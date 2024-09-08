var socket = io("http://localhost:3000/");

socket.on("Sever-send-data", function (data) {
    $("#noidung").append(data);
})
$(document).ready(function () {
    // $("#mrA").click(
    //     function () {
    //         socket.emit("Client-send-data", "hello boy")
    //     }
    // );
    alert(1);

})