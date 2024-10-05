function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  
    return JSON.parse(jsonPayload);
  }
  
  function getSecret() {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqaGlqa2tqa2pramtqIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJhcGlLZXkiOiJBSXphU3lEWmw3dXBVMFlLdGtpZzdDaHRESjBvZno0VUtlc2ltTmsifQ.O6xAtOgi73th3fh0o_DVlP5FqcKGjsGfno4bEo2T5rU";
    return parseJwt(token);
  }