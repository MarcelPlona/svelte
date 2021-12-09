<script>
    import { logged } from "./store";

    let email;
    let password;
    let password2;
    let err = ''

    function auth() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password, password2: password2 }),
        };

        //zapis do bazy danych zmian
        fetch(`http://giereczka.pl/api/register`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                err = '';
                if(data.err){
                    err = data.err;
                    return;
                }
                if(data.res == "y"){
                    $logged = "login";
                }
                else{
                    console.log("error");
                }
                
            });
    }

    const log = () => {
        $logged = "login";
    }
</script>

<div class="register">
    <div>Register</div>
    <div class="error">{err}</div>
    <input type="email" placeholder="email" name="email" bind:value={email} />
    <input type="password" placeholder="password" name="password" bind:value={password} />
    <input type="password" placeholder="password" name="password2" bind:value={password2} />
    <input type="submit" value="Register" on:click={auth} />
    <input type="submit" value="Login" on:click={log} />

</div>

<style>

    .register{
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

    .register .error{
        color:red;
        font-size:16px;
    }

    .register div:first-of-type{
        margin-top:20px;
        font-size: 30px;
    }

    .register input{
        margin-top:30px;
    }
    
</style>