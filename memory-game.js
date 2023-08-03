let counter=0;
let firstCard="";
let secondCard=""; 
let finish=0;
const cards =document.querySelectorAll(".cards .card");
let cardsArray = [...cards];
let disneyCharactersData;
let timestamp1;
let timestamp2;
let start = 0;


function myFunction() {

    if(sessionStorage.getItem('flag') === null){
        sessionStorage.setItem("numberOfPage", 1);}
    $.ajax({
        url:'https://api.disneyapi.dev/character?page=' + sessionStorage.getItem('numberOfPage'),
        dataType: 'json',
        success: function(data) {
        disneyCharactersData = data;
        const selectedCharacters = [];
        while (selectedCharacters.length < 10) {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const character = data.data[randomIndex];
            if (!selectedCharacters.includes(character)) {
                selectedCharacters.push(character);
            }
        }
        const cards = $('.card');
        for (let i = 0; i < cards.length; i += 2) {
            const card1 = cards[i];
            const card2 = cards[i + 1];
            const img1 = $(card1).find('img');
            const img2 = $(card2).find('img');
            const name1 = $(card1).attr('photo_');
            const name2 = $(card2).attr('photo_');
            $(img1).attr('src', selectedCharacters[i / 2].imageUrl);
            $(img2).attr('src', selectedCharacters[i / 2].imageUrl);
            $(card1).append($('<p>').text(selectedCharacters[i / 2].name));
            $(card2).append($('<p>').text(selectedCharacters[i / 2].name));
            $(card1).attr('photo_', name1);
            $(card2).attr('photo_', name2);
        }
        const cardsArray = $('.card');
        cardsArray.sort(() => Math.random() - 0.5);
        $('.cards').html(cardsArray);
    },
    error: function() {
        alert('Error!');
    }
});

			
    $('.newGame-button').click(function(){ 
        if(start == 1)
            return;
        start = 1;    
        $(".cards").css("visibility", "visible");
       $.ajax({
    url: 'get_current_time.php',
    type: 'GET',
    dataType: 'text',
    success: function(data) {
        timestamp1 = new Date(parseInt(data) * 1000);
        // Format the date as a string in the format "HH:mm:ss"
        let timeString = timestamp1.toTimeString().split(' ')[0];
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // handle error
        alert("Error!");
    }
});
    
   
    });


// Add the shuffled cards back to the DOM
cardsArray.forEach((card) => {
  card.parentNode.appendChild(card);
});
cards.forEach((card) => {
    card.addEventListener("click", () =>{
        //only two cards each time
        if (document.querySelectorAll(".card.clicked").length >= 2) {
            return;
        }
        card.classList.add("clicked");
        if(counter === 0){//we didnt select anything
            firstCard = card.getAttribute("photo_"); 
            counter++;
            // card.style.pointerEvents = "none";

        }else{// if the counter is 1
            secondCard=card.getAttribute("photo_");
            counter=0;
            //the same card
            if (firstCard === secondCard) {
                finish++;
                // Find the cards with the matching "photo_" attribute
                const correctCards = document.querySelectorAll(
                  ".card[photo_='" + firstCard + "']"
                );


                // Add the "checked" class to each card
                correctCards.forEach((card) => {
                    card.style.pointerEvents = "none";

                  card.classList.add("checked");
                  // Remove the "clicked" class since the cards are now "checked"
                  card.classList.remove("clicked");
                });
                //serach the same card in the disneyCharactersData
                for(let i = 0 ;i < disneyCharactersData.data.length;i++){
                    if(disneyCharactersData.data[i].name === $(card).find('p').text()){
                        let message1 = document.createElement("div");
                        message1.innerHTML = "Very nice! You made it!<br><br>Here are some details about the character:<br><br>";
                        for (let prop in disneyCharactersData.data[i]) {
                            if(prop == "films" || prop == "shortFilms" || prop == "tvShows" || prop == "videoGames" || prop == "parkAttractions")
                                message1.innerHTML += prop + ': ' + disneyCharactersData.data[i][prop] + '<br>';}
                        message1.classList.add("message1");
                        document.body.appendChild(message1);
                         setTimeout(() => {
                        if(document.body.contains(message1))
                            document.body.removeChild(message1);
                     }, 5000);
                         }
                }
                
            }
            else{// the cards are different...
                // Find the cards with the "clicked" class
                const incorrectCards = document.querySelectorAll(".card.clicked");

                // Add the "shake" class to each card
                incorrectCards.forEach((card) => {
                card.classList.add("shake");
                });

                // the "clicked" and "shake" classes remove after 3 seconds
                setTimeout(() => {
                incorrectCards.forEach((card) => {
                card.classList.remove("clicked");
                card.classList.remove("shake");
                });
                }, 1800);
                
                let message = document.createElement("div");
                message.innerHTML = "You were wrong! No problem, try again<span class='message__close'>&times;</span>";
                message.classList.add("message");
                document.body.appendChild(message);

                // Attach a click event listener to the close button
                let closeButton = message.querySelector(".message__close");
                closeButton.addEventListener("click", () => {
                 message.classList.remove("message");
                document.body.removeChild(message);
                    });
                
                // Remove the message after 3 seconds
                    setTimeout(() => {
                        if(document.body.contains(message))
                            document.body.removeChild(message);
                     }, 2000);
}
            
        }
        //finish the game
        if(finish === 10){
            //ajax call to the php page
            let timeStr2;
             $.ajax({
                url: 'get_current_time.php',
                type: 'GET',
                dataType: 'text',
                success: function(data) {
                    timestamp2 = new Date(parseInt(data) * 1000);
                    let diff = Math.abs(timestamp1 - timestamp2);
                    let hours = Math.floor((diff/1000)/3600);
                    let minutes = Math.floor((diff/1000)/60);
                    let seconds = Math.floor((diff/1000));
                    let successMes = document.createElement("div");
                    successMes.innerHTML = "<h2>END GAME</h2>Congratulations! You won the game in:<br>";
                    if(hours != 0){
                        successMes.innerHTML += "hours:"+hours+"<br>"} 
                    if(minutes != 0){
                        seconds = seconds - (minutes * 60);
                        successMes.innerHTML += "minutes:" +minutes +"<br>" ;}
                    if(seconds != 0 )
                        successMes.innerHTML += "seconds:"+seconds+"<br>";
                    successMes.innerHTML += "<button class = newGame1-button>NEW GAME</button>";    
                    successMes.classList.add("successMes");
                    document.body.appendChild(successMes);
                    let refreshButton = document.querySelector('.newGame1-button');
                    refreshButton.addEventListener('click', function() {
                        start = 0;
                        let n = parseInt(sessionStorage.getItem('numberOfPage'));
                        n += 1;
                        //last page
                        if(n == 150)
                            n = 1;
                        sessionStorage.setItem("numberOfPage", n); 
                        sessionStorage.setItem("flag", 1);
                        location.reload();
                                });
                
                        },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("Error!");
                        }
});

        }
    });
});

}

