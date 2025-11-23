import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'

function DayColumn({ day, date, status }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-10 pb-1 pt-5 px-0 flex items-center rounded-full",
          status === "current" ? "bg-foreground" : "bg-transparent"
        )}
      >
        <div
          className={cn(
            "text-xs font-semibold leading-none",
            status === "current" ? "text-background" : "text-muted-foreground"
          )}
        >
          {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
        </div>
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center mt-1",
            status === "completed" && "bg-green-100 dark:bg-green-900",
            status === "missed" && "bg-red-100 dark:bg-red-900",
            (status === "current" || status === "upcoming") && "bg-background"
          )}
        >
          <div
            className={cn(
              "text-xs font-bold",
              status === "current" ? "text-foreground" : cn(
                status === "completed" && "text-green-700 dark:text-green-300",
                status === "missed" && "text-red-700 dark:text-red-300",
                status === "upcoming" && "text-muted-foreground"
              )
            )}
          >
            {date}
          </div>
        </div>
      </div>
    </div>
  )
}

function determineStatus(date, completed) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  
  if (compareDate.getTime() === today.getTime()) {
    return "current"
  }
  
  if (compareDate > today) {
    return "upcoming"
  }
  
  return completed ? "completed" : "missed"
}

function calculateStreak(weeklyStreak) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // If no weeklyStreak data, create a week starting from today with all days as upcoming except current
  if (!weeklyStreak || !weeklyStreak.week_start) {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - 3 + index) // Start 3 days before today
      
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      
      return {
        day: dayNames[date.getDay()],
        date: date.getDate(),
        status: date.getTime() === today.getTime() ? "current" : "upcoming"
      }
    })
  }

  // If we have weeklyStreak data, use it
  const weekStartLocal = new Date(weeklyStreak.week_start)
  // Adjust for timezone offset
  weekStartLocal.setMinutes(weekStartLocal.getMinutes() + weekStartLocal.getTimezoneOffset())
  weekStartLocal.setHours(0, 0, 0, 0)
  
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStartLocal)
    date.setDate(weekStartLocal.getDate() + index)
    
    const isCompleted = weeklyStreak.streak_days?.includes(index)
    
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const dayOfWeek = date.getDay()

    return {
      day: dayNames[dayOfWeek],
      date: date.getDate(),
      status: determineStatus(date, isCompleted)
    }
  })
}

export function WeeklyStreak({ streakData }) {
  const streak = calculateStreak(streakData)
  
  // Calculate date range for display
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let firstDate, lastDate
  if (streakData && streakData.week_start) {
    firstDate = new Date(streakData.week_start)
    firstDate.setMinutes(firstDate.getMinutes() + firstDate.getTimezoneOffset())
    firstDate.setHours(0, 0, 0, 0)
    lastDate = new Date(firstDate)
    lastDate.setDate(lastDate.getDate() + 6)
  } else {
    firstDate = new Date(today)
    firstDate.setDate(today.getDate() - 3)
    lastDate = new Date(today)
    lastDate.setDate(today.getDate() + 3)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">
          Weekly Streak ({formatDate(firstDate)} - {formatDate(lastDate)})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          {streak.map((day, index) => (
            <DayColumn
              key={`${day.date}-${index}`}
              day={day.day}
              date={day.date}
              status={day.status}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
