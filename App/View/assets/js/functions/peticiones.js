export async function ObtenerUsuarioLoggeado() {

    const data = new FormData();
    data.append('action', 'getUser');

    const response = await fetch("../Service/UserService.php", {
        method: "POST",
        body: data
    });

    if(response.ok) {
        const json = await response.json();

        return json;
    }
    else {
        return false;
    }
}