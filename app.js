const url = "http://5eb4-98-128-229-80.ngrok.io/";
const array_of_placeholders = ["Message in a bottle", "Message to the moon", "Leave a message at the tone", "Return to sender, adress unknown. No such number, no such zone", "Them late night messages", "Now, I endorse this message", "Staring at the blank page before you", "I'm messaging the man in the mirror"]

const messagebox = document.getElementById("messagebox_input");
const textarea = document.createElement("textarea");
textarea.className = "form-control";
textarea.rows = "3";
textarea.id = 'input';
textarea.placeholder = array_of_placeholders[Math.floor(Math.random() * 8)] + '...';
messagebox.appendChild(textarea);


function renderInteractionList(data) {
  const interaction = document.createElement("div");
  const interactionList = document.createElement("ul");

  const likes = document.createElement("li");
  likes.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" 
width="16" 
height="16" 
fill="currentColor" 
class="bi bi-emoji-heart-eyes-fill" 
viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.559 5.448a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zm-.07-5.448c1.397-.864 3.543 1.838-.953 3.434-3.067-3.554.19-4.858.952-3.434z"/>
</svg> ${data.likes}`;

likes.addEventListener('click',(e) => {
  const uuid = e.path[2].id;
  update_tweet(uuid, 'like');
})

  const dislikes = document.createElement("li");
  dislikes.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-frown-fill" viewBox="0 0 16 16">
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-2.715 5.933a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
</svg> ${data.dislikes}`;

dislikes.addEventListener('click',(e) => {
  const uuid = e.path[2].id;
  update_tweet(uuid, 'dislike');
})

  const shares = document.createElement("li");
  shares.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
</svg> ${data.shares}`;

shares.addEventListener('click',(e) => {
  const uuid = e.path[2].id;
  update_tweet(uuid, 'share');
})

  interactionList.appendChild(likes);
  interactionList.appendChild(dislikes);
  interactionList.appendChild(shares);

  return interaction.appendChild(interactionList);
}

function renderTweet(data) {
  const messageboard = document.getElementById("messageboard");
  const tweet = document.createElement("article");
  tweet.id = data.uuid;
  const user = document.createElement("strong");
  user.innerText = `${data.username}`;
  const content = document.createElement("p");
  content.innerText = `${data.content}`;

  const interaction = renderInteractionList(data);

  tweet.appendChild(user);
  tweet.appendChild(content);
  tweet.appendChild(interaction);

  messageboard.prepend(tweet);
}

function getTweets() {
  fetch(url + 'get_posts')
    .then((res) => res.json())
    .then((data) => data.forEach(el => renderTweet(el)));
}
getTweets();

function post_tweet() {
  let username = document.getElementById('username-input').value;
  if(username.length === 0) username = null;

  const new_post = {
    img_src: null,
    title: 'Tweet',
    content: document.getElementById('input').value,
    username: username,
    likes: 0,
    dislikes: 0,
    shares: 0
  }
  const data = JSON.stringify(new_post);

  fetch(url + 'save_post', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: data
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('input').value = '';
      renderTweet(data);
    })
}


localStorage.setItem('liked', JSON.stringify([]));
localStorage.setItem('disliked', JSON.stringify([]));
localStorage.setItem('shared', JSON.stringify([]));

const update_tweet = (uuid, type) => {
  const update = {
    type:type,
    uuid:uuid
  } 
  const data = JSON.stringify(update);

  const liked = JSON.parse(localStorage.getItem('liked'));
  const disliked = JSON.parse(localStorage.getItem('disliked'));
  const shared = JSON.parse(localStorage.getItem('shared'));

  if(type === 'like' && !liked.includes(uuid) && !disliked.includes(uuid)){
    console.log(liked)
    liked.push(uuid);
    localStorage.setItem('liked', JSON.stringify(liked));

    fetch(url + 'update_post', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: data
    })
      .then(res => res.json())
      .then(res => {
    document.getElementById(uuid).children[2].children[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    fill="currentColor" 
    class="bi bi-emoji-heart-eyes-fill" 
    viewBox="0 0 16 16">
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.559 5.448a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zm-.07-5.448c1.397-.864 3.543 1.838-.953 3.434-3.067-3.554.19-4.858.952-3.434z"/>
    </svg> ${res.data.likes}`;
    })
  } else if(type === 'dislike' && !disliked.includes(uuid) && !liked.includes(uuid)){
    disliked.push(uuid);
    localStorage.setItem('disliked', JSON.stringify(disliked));

    fetch(url + 'update_post', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: data
    })
      .then(res => res.json())
      .then(res => {
    document.getElementById(uuid).children[2].children[1].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-frown-fill" viewBox="0 0 16 16">
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-2.715 5.933a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
  </svg> ${res.data.dislikes}`;
        })
      }
      else if(type === 'share' && !shared.includes(uuid)){
        shared.push(uuid);
        localStorage.setItem('shared', JSON.stringify(shared));

        fetch(url + 'update_post', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: data
        })
          .then(res => res.json())
          .then(res => {
            document.getElementById(uuid).children[2].children[2].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
          </svg> ${res.data.shares}`;
          })
      }
}
