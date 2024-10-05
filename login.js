let authToken = localStorage.getItem("authToken");
if(authToken)
{
  window.location.href="home.html"
}
document.querySelector("#loginForm").addEventListener("submit", login);

function login() {
  event.preventDefault();
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  loginWithFetch(email, password);
}

const loginWithFetch = (email, password) => {
  const secrete = getSecret();
  console.log(secrete, "ecr");
  fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${secrete.apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error.message);
      } else {
        alert("Succesfully login");
        let log = document.getElementById("logout");
        console.log(log);

        console.log("User logged in:", data);
        localStorage.setItem("authToken", data.idToken);
        window.location.href = "home.html";
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error.message);
    });
};

// Example usage