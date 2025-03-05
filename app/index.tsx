import { Redirect } from "expo-router";

// currently just redirects
// at some point will add login here
// if already logged in, redirect to tasks
// if not logged in, redirect to login
export default function Page() {
  return <Redirect href="/(tabs)/tasks" />;
}
