# Solve Screen Flow

Author: Jonnie Oak  
Date: 6/8/2025  
Last Modified: 6/8/2025  

#### Introduction
The Solve Screen flow has not been fully flushed out. Now that we are a point where the app is "good enough" and in a testing state, we should consider what we want the full flow of the Solve Screen will be. For both development and production.

#### Existing System
Currently, the Solve Screen works as such:
1. When a user clicks on a question, the app redirects the user to the Solve Screen with the params: `id` (questionId) and `title` (questionTitle).
2. The screen initializes with two main states: `questionData` for question details and `userQuestionData` for user-specific information.
3. Upon mounting, the screen:
   - Loads question data (description, constraints, boilerplate solution)
   - Checks for existing user question data
   - If no user question exists:
     * Creates a new user question record
     * Initializes empty user data structure
   - If user question exists:
     * Loads existing user data including submission history and hint chat
4. The UI displays:
   - A header with back navigation
   - Question description and constraints
   - Pseudocode container with boilerplate solution
   - Loading states during data fetch
   - Error messages if data loading fails
5. The hint system is currently placeholder:
   - Structure exists for hint chat history
   - Messages track user/bot attribution and timestamps
   - Actual hint request functionality is not implemented

#### The Plan

> Note: The questionTitle will be fetched from userQuestionFile instead of being passed as a parameter.

The main state `userQuestionData` will be maintained by userQuestionFile.

Initial Data Flow
* User gets redirected to the Solve Screen
* Fetch required files:
  * questionFile
  * userQuestionFile
* Handle user question state:
  * If userQuestionFile exists:
    * Render using all three files
  * If userQuestionFile does not exist:
    * Initiate an empty userQuestionData state that can map to userQuestionFile
    * Create new record in `public.user_question` table

Solution Storage Strategy
* Local Updates
  * Store solution in local state (React state)
  * Maintain backup in AsyncStorage every 5 seconds
  * Track dirty state with "Saving..." indicator

* Persistent Storage
  * Auto-save to Supabase (2.5s debounce)
  * Use delta changes to minimize data transfer
  * Show save state feedback
  * Offline handling:
    * Continue local saves
    * Queue changes for sync
    * Show offline indicator
    * Sync when connection restores

* Background/Exit Handling
  * Immediate save on app background
  * Immediate save on screen exit
  * Failed save handling:
    * Keep local copy
    * Show exit warning
    * Retry on next app open

User Interactions
* Submission Flow
  * Immediate save to Supabase
  * Show loading state
  * Require online connection
  * Handle validation errors

* Hint System
  * Immediate local state updates
  * Supabase sync with retry
  * Offline hint caching

Error Management
* Network Issues
  * Exponential backoff for retries
  * Sync status indicators
  * Offline work support

* Conflict Resolution
  * Timestamp-based versioning
  * Server version comparison
  * Conflict handling:
    * Show diff to user
    * Version selection
    * Local history tracking

Mobile Optimizations
* Performance
  * Batch updates
  * Battery-aware save frequency
  * Data compression
  * Aggressive caching

#### Implementation

Need for MVP
1. [X] Remove questionTitle from SolveScreen params
2. [ ] Modify logic for fetching and displaying the blob files
3. [ ] Create a (temporary) save button that will save userQuestionData to userQuestionFile (for testing purposes)
3. [X] Create a userQuestionData -> userQuestionFile mapper
3. [ ] User can submit a solution and update userQuestionFile
4. [ ] User can requrest a hint and update userQuestionFile

Bonus Items / Post-MVP
1. [ ] Solution Storage Solutions (local saves, persistant storage, savings indicators, offline mode, etc...)
2. [ ] Error Management (exponential backofffs, diff compares, etc...)
3. [ ] Mobile Optimizations (battery-aware save frequency, data compression, caching, etc...)

#### Implementation Examples

Empty UserQuestion File
```json
{
  "user_id": "",
  "question_id": "",
  "submission": {
    "solution": "",
    "timestamp": ""
  },
  "hint_chat": {
    "messages": [
      {
        "from": "",
        "message": "",
        "timestamp": ""
      }
    ]
  }
}
```

State Management
* Create a custom hook for managing solution state:
```typescript
interface SolutionState {
  localSolution: string;
  lastSavedSolution: string;
  isDirty: boolean;
  saveStatus: 'saving' | 'saved' | 'error' | 'offline';
  lastSyncTimestamp: number;
}

function useSolutionState(initialSolution: string) {
  const [state, setState] = useState<SolutionState>({
    localSolution: initialSolution,
    lastSavedSolution: initialSolution,
    isDirty: false,
    saveStatus: 'saved',
    lastSyncTimestamp: Date.now()
  });

  // ... state management logic
}
```

Local Storage
* Implement AsyncStorage wrapper for solution backup:
```typescript
const STORAGE_KEYS = {
  SOLUTION: (questionId: string) => `@pseudo/solution/${questionId}`,
  SYNC_QUEUE: '@pseudo/sync_queue'
};

async function backupSolution(questionId: string, solution: string) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SOLUTION(questionId),
      JSON.stringify({
        solution,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    console.error('Failed to backup solution:', error);
  }
}
```

Sync Management
* Create a background sync queue manager:
```typescript
interface SyncQueueItem {
  questionId: string;
  solution: string;
  timestamp: number;
  retryCount: number;
}

class SyncQueueManager {
  private queue: SyncQueueItem[] = [];
  private isProcessing = false;

  async addToQueue(item: SyncQueueItem) {
    this.queue.push(item);
    await this.persistQueue();
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // ... queue processing logic
}
```

Delta Updates
* Implement diff generation for efficient updates:
```typescript
interface SolutionDiff {
  timestamp: number;
  changes: Array<{
    type: 'insert' | 'delete' | 'replace';
    position: number;
    content: string;
  }>;
}

function generateDiff(oldSolution: string, newSolution: string): SolutionDiff {
  // Use diff-match-patch or similar library
  // Return minimal changes needed
}
```

Offline Support
* Add network state monitoring and offline mode handler:
```typescript
function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const syncQueue = useSyncQueue();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newIsOnline = state.isConnected && state.isInternetReachable;
      setIsOnline(newIsOnline);
      
      if (newIsOnline) {
        syncQueue.processQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  return { isOnline };
}
```

Conflict Resolution
* Implement version control and conflict detection:
```typescript
interface VersionedSolution {
  content: string;
  baseVersion: number;
  timestamp: number;
  localChanges?: SolutionDiff[];
}

async function resolveConflict(
  local: VersionedSolution,
  server: VersionedSolution
): Promise<VersionedSolution> {
  if (local.baseVersion === server.baseVersion) {
    // Fast-forward possible
    return local;
  }

  // Show diff UI and let user choose
  const resolution = await showConflictUI(local, server);
  return resolution;
}
```

Battery Optimization
* Add battery-aware sync scheduling:
```typescript
function useBatteryAwareSync(defaultInterval: number) {
  const [syncInterval, setSyncInterval] = useState(defaultInterval);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const checkBattery = async () => {
      const battery = await getBatteryLevel();
      
      // Adjust sync interval based on battery
      if (battery < 0.2) {
        setSyncInterval(defaultInterval * 2);
      } else {
        setSyncInterval(defaultInterval);
      }
    };

    const subscription = BatteryState.addEventListener('change', checkBattery);
    return () => subscription.remove();
  }, [defaultInterval]);

  return syncInterval;
}
```