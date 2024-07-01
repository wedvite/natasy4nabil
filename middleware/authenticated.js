export default function ({
  redirect
}) {
  // If the user is authenticated redirect to home page
  if (!localStorage.getItem("loggedInUser")) {
    return redirect('/login')
  }
}
