$(document.head).append('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">\n')
$(document.head).append(` <style> body{
   padding:0;
   margin: 0;
}
.chatballon{
    background: #f14895;
    height: 80px;
    width: 80px;
    position: fixed;
    bottom: 15px;
    right: 15px;
    border-radius: 50px;
    border: solid 1px #0a0a0a;
    box-shadow: 1px 6px 5px;
    cursor:pointer;
}
.chatballon i{
    padding-top: 19px;
   font-size: 40px;
}
.chatspace{

    height:0; /*400px*/
    width: 0; /*340px*/
    background: #d7d1de;
    border-radius: 5px;
    position: fixed;
    bottom: 20px;
    right: 30px;
    box-shadow: -1px 8px 8px;
    transition: all 500ms ease-in;
    scroll-behavior: smooth;

}
.text-space,.chatbottonera,.typespace{
    display: none;
}
.chatbottonera{
    height:27px;
    width: 100%;
    background: #343030;
    color:white;
    padding:5px;
    box-sizing: border-box;
    border-radius: 4px 4px 0 0;
}
.chatbottonera .close{
    font-size: 18px;
    padding-right:10px;
    padding-bottom:10px;
   
}
.typespace{
    width: 100%;

    padding:10px;
    position:fixed;
    bottom:25px;
}
.myinput{
    width: 230px;
    margin-right: 10px;
}
.send{
    width:80px;
}
.input-message,.output-message{
    padding:5px;
    border-radius:10px;
}
.input-message{
    background:white;
    width:50%;
    margin-left:10px;
    padding-left:10px
}
.input-message::after{
    content: "";
    position: relative;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 13px 13px 13px 13px;
    top:-18px;
    border-right-color: white;
    left: -30px;
}
.output-message{
    --color-sended : attr(colordata);
    background: #1b1e21;
    color:white;
    width:60%;
    display: flex;
    align-content: flex-end;
    margin-right: 13px;
}
:root{
 
}
.output-message::after{
   
    content: "";
    position: relative;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 13px 13px 13px 13px;
    top: 0px;
    border-left-color: var(--color-sended);
    right: -114px;
}
.container-output{
    padding:10px;
    display:flex;
    flex-direction: row-reverse;
}
.container-input{
    padding:10px;
    display:flex;
    padding:10px
}
.text-space{
    overflow-y: auto;
    overflow-x:hidden;
    height: auto;
    max-height: 310px;
    width: 100%;
}
.text-space::-webkit-scrollbar {
    width: 4px;
}

/* Track */
.text-space::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

/* Handle */
.text-space::-webkit-scrollbar-thumb {
    background: #6d6b6b;
    border-radius: 10px;
}

/* Handle on hover */
.text-space::-webkit-scrollbar-thumb:hover {
    background: #6d6b6b;
}
.avatar img{
    height:30px;
}</style>`);

$(document.body).append('<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>')
///chatbubble
$(document.body).append('<div class="chatballon text-center"> <i class="fas fa-comments"></i></div>')

$(document.body).append('<div class="chatspace"><div class="chatbottonera text-right"> <i class="close fas fa-times"></i></div><div class="text-space"><div class="container-input"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/Martin-Berube-Flat-Animal-Parrot.ico" alt="img"></div><div class="input-message"><p>hola como estas</p></div></div><div class="container-output text-right"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/neutral.ico" alt="img"></div><div class="output-message align-content-end"><p>Muy bien y tu?</p></div></div><div class="container-input"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/Martin-Berube-Square-Animal-Deer.ico" alt="img"></div><div class="input-message"><p>hola como estas</p></div></div><div class="container-output text-right"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/neutral.ico" alt="img"></div><div class="output-message align-content-end"><p>Muy bien y tu?</p></div></div><div class="container-input"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/jaguar.ico" alt="img"></div><div class="input-message"><p>hola como estas</p></div></div><div class="container-output text-right"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/neutral.ico" alt="img"></div><div class="output-message align-content-end"><p>Muy bien y tu?</p></div></div><div class="container-input"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/iguana.ico" alt="img"></div><div class="input-message"><p>hola como estas</p></div></div><div class="container-output text-right"><div class="avatar"> <img src="https://bf875211bee1.ngrok.io/enso/content/files/icons-enso/neutral.ico" alt="img"></div><div class="output-message align-content-end"><p>Muy bien y tu?</p></div></div></div><div class="typespace "> <input class="myinput form-control" placeholder="Escribe algo"><button class="send btn btn-primary"> <i class="fas fa-paper-plane"></i> </button></div></div>')
$(document.body).append('<script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>')

$(document).ready(function () {
    $(".chatballon").click(function () {
        $(this).hide()
        $(".chatspace").css("height","400")
        $(".chatspace").css("width","340")
        setTimeout(function () {
            $(".text-space").show()
            $(".chatbottonera").show()
            $(".typespace").css("display","inline-flex")
        },510)

    })
    $(".close").click(function () {
        $(".text-space").hide()
        $(".chatbottonera").hide()
        $(".typespace").hide()
        $(".chatspace").css("height","0")
        $(".chatspace").css("width","0")

        setTimeout(function () {
            $(".chatballon").show()
        },510)


    })
})

let EnsoBot = function (chatID,BasePathensoChatBot_site) {
    console.log(chatID)
    let chatid = chatID
    let baseURLenso = BasePathensoChatBot_site;
    let elem = this
    this.baseURL = BasePathensoChatBot_site

    $.getJSON(baseURLenso + 'app/api/chatbot/'+"5ed553401c73b503b759fba9/"+chatid, {}, function (response) {
        console.log(response)
        if(response.success){
            $('.chatballon').css("background",response.data.primary_color)
            $('.output-message').css("background",response.data.primary_color)
            $('.output-message:after').css("background",response.data.primary_color)
            $('.close').css("color",response.data.secundary_color)
            $('.chatbottonera').css("background",response.data.primary_color)
            $('.chatballon i').css("color",response.data.secundary_color)
            let container = document.querySelectorAll('.output-message')


            for (let item of container)
            {
                item.style.setProperty('--color-sended',response.data.primary_color)
            }

        }
    });

    this.inicialize = function () {
        let el = this

    }
    elem.socket = {}
    elem.ConnectedSocket = false;

    this.waitUntilIO = function () {
        let el = this

        try{console.log( el.baseURL+'websocket/connector')
            el.socket = io.connect(el.baseURL + 'ensoSocket', {
                reconnection: true,
                reconnectionDelay: 10000,
                reconnectionDelayMax: 50000,
                reconnectionAttempts: Infinity,
                path: el.baseURL+'websocket/connector',
                transport: ['websocket']
            });


            el.socket.on('connect', function () {
                console.log('coneected');

            })


        }catch (e) {
            setTimeout(function () {
                el.waitUntilIO()
            }, 1000)

        }
    }
    elem.waitUntilIO()

}