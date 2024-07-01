
export default function ({
  redirect
}) {
  // If the user is authenticated redirect to user page
  if (localStorage.getItem("loggedInUser")) {
    return redirect('/user')
  }
}
