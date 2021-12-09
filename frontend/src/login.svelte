<script>
    import { logged, token } from "./store";

    let email;
    let password;
    let remember;
    let err = ''

    function auth() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        };
       
        //zapis do bazy danych zmian
        fetch(`http://giereczka.pl/api/login`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                err = '';
                if(data.err){
                    err = data.err;
                    return;
                }
                if (data.token) {
                    if (!remember) {
                        document.cookie = "token=" + data.token;
                    } else {
                        const time = (60 * 60 * 24 * 365).toString();
                        document.cookie =
                            "token=" + data.token + ";max-age=" + time;
                    }
                    console.log(remember)
                    $token = data.token;
                    $logged = "yes";
                }
            });
    }

    const register = () => {
        $logged = "register";
    };
</script>

<div class="login">
    <div>Login</div>
    <div class="error">{err}</div>
    <input type="email" placeholder="email" name="email" bind:value={email} />
    <input type="password" placeholder="password" name="password" bind:value={password} />
    <label>
        <input type="checkbox" bind:checked={remember} /> Remember me
    </label>
    <input type="submit" value="Login" on:click={auth} />
    <input type="submit" value="Register" on:click={register} />
</div>

<style>

    .login{
        width:240px;
        height:380px;
        display: flex;
        align-items: center;
        flex-direction: column;
        background-color: rgb(248, 118, 31);
        position: fixed;
        transform: translate(-50%,-50%);
        left:50%;
        top:50%;
        border-radius: 20px;
        color: white;
    }

    .login .error{
        color:red;
        font-size:16px;
    }

    .login div:first-of-type{
        margin-top:20px;
        font-size: 30px;
    }

    .login input{
        margin-top:30px;
    }
    
</style>
