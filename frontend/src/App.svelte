<script>
	import Grid from "./grid.svelte";
	import Login from "./login.svelte";
	import Register from "./register.svelte";
	import { logged, token } from "./store.js";

	document.cookie.split("; ").forEach((ele) => {
		if (ele.split("=")[0] == "token") {
			$token = ele.split("=")[1];
		}
	});

	if(!$token){
		$logged = "login"
	}

</script>

{#if $logged == "yes"}
	<Grid />
{:else if $logged == "login"}
	<Login />
{:else if $logged == "register"}
	<Register />
{/if}
