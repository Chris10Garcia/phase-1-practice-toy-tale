let addToy = false;

// single spot for URL and settings to minimize spelling issues
const toyURL = 'http://localhost:3000/toys'
const appJSON = "application/json"


document.addEventListener("DOMContentLoaded", () => {

  // get data and pass it to buildCard function
  fetch(toyURL, {
      method: "GET",
      headers: {'Content-Type' : appJSON}
      }
    )
      .then(respnse => respnse.json())
      .then(data => data.forEach(obj => buildPlaceCard(obj)))


  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
});


/* general purpose buildcard function
    since this is being used for both the initial data load AND
    when users add data, I choose NOT to use innerHTML for
    security reasons */  
function buildPlaceCard(obj){

  const h2 = document.createElement('h2')
  h2.innerText = obj.name

  const img = document.createElement('img')
  img.setAttribute('src', obj.image)
  img.className = "toy-avatar"

  const p = document.createElement('p')
  p.innerText = `${obj.likes} likes`


  const bttn = document.createElement('button')
  bttn.className = 'like-btn'
  bttn.id = `${obj.id}`
  bttn.innerText = `like ❤️`
  bttn.dataset.likes = obj.likes   // to minimize string manipulation, added a like tracker within button (not sure if security risk)
  bttn.addEventListener('click', (e)=> likeBtnClick(e))

  const div = document.createElement('div')
  
  div.append(h2, img, p, bttn)

  document.getElementById('toy-collection').append(div)
}


// adds new toy
function createNewToy(e){
  
  // building single card object
  let newCard = {
    "name": e.target.querySelectorAll('.input-text')[0].value,
    "image": e.target.querySelectorAll('.input-text')[1].value,
    "likes": 0
  }

  // post object and build card
  fetch(toyURL, {
    method: "POST",
    headers: {"Content-Type" : appJSON, Accept: appJSON},
    body: JSON.stringify(newCard)
  })
    .then(resp => resp.json())
    .then(data => buildPlaceCard(data))
}

// handles likes
function likeBtnClick(e){
  const id = e.target.id
  let likes = e.target.dataset.likes
  likes ++

  fetch(`${toyURL}/${id}`, {
    method: "PATCH",
    headers: {"Content-Type" : appJSON, Accept: appJSON},
    body: JSON.stringify({"likes": likes})
    } 
  )
    .then(resp => resp.json())
    .then(data => updateCard(data))
    
}





function updateCard(obj){
  const toyCard = document.querySelector(`[id = "${obj.id}"]`)

  toyCard.dataset.likes = obj.likes
  toyCard.parentNode.querySelector('p').innerText = `${obj.likes} likes`
}


document.addEventListener('submit', (e) => {
  e.preventDefault()
  createNewToy(e)
})


