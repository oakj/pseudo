import { AuthTest } from '../components/AuthTest'
import { UserDataTest } from '../components/UserDataTest'
import { SolveScreenTest } from '../components/SolveScreenTest'
import { CollectionTest } from '../components/CollectionTest'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

export function Testing() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pseudo Web - Database Test Suite</CardTitle>
          <CardDescription>
            Test all database calls from the mobile frontend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuthTest />
          <UserDataTest />
          <SolveScreenTest />
          <CollectionTest />
        </CardContent>
      </Card>
    </div>
  )
}
