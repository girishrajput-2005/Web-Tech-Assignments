<?php 
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Check if user exists and password matches the nested array
    if (isset($_SESSION['users'][$username]) && $_SESSION['users'][$username]['password'] == $password) {
        $_SESSION['logged_in_user'] = $username;
        $_SESSION['logged_in_phone'] = $_SESSION['users'][$username]['phone']; // Grab phone number
        header("Location: calculator.php");
        exit();
    } else {
        $error = "Invalid Username or Password!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white text-center">
                        <h3>Login</h3>
                    </div>
                    <div class="card-body">
                        <?php if(isset($error)) echo "<div class='alert alert-danger'>$error</div>"; ?>
                        <form method="POST">
                            <label class="form-label">Username</label>
                            <input type="text" name="username" class="form-control" required>
                            <label class="form-label mt-2">Password</label>
                            <input type="password" name="password" class="form-control" required>
                            <button type="submit" class="btn btn-primary w-100 mt-4">Login</button>
                        </form>
                        <p class="mt-3 text-center"><a href="index.php">Back to Home</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>