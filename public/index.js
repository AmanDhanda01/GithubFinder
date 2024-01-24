const button = document.querySelector(".button");
const profile = document.querySelector(".profile");
const repoContainer = document.querySelector(".repos");
const pagination = document.querySelector(".pagination");
var user = "";

button.addEventListener("click",async (e) =>{
    e.preventDefault();
    const username = document.querySelector("#input").value;
    const res = await fetch("/search",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({name:username})
    });
     const data = await res.json();
     user = username;
     document.querySelector(".repos").innerHTML = "";
     pagination.innerHTML = "";
     console.log(data);
     appendUser(data.user);
     if(data.repos.length>0){
           appendRepos(data.repos);    
     }else{

           const p = document.createElement("p");
           p.innerText = "There is no public repository available for the user";
           p.classList.add("error");
           document.querySelector(".repos").appendChild(p);
     }
     if(data.user.public_repos>10){
          appendPagination(data.user.public_repos);
     }
             
});




const appendUser = async (userData) =>{
    const profilePhoto = `
       <div class=info>
                   <img class=image src = ${userData.avatar_url}>
                   <a  href=${userData.html_url}>${userData.html_url}</a>
       </div>
       <div>
                <p class=username>${userData.name || ""}</p>
                <p class = bio>${userData.bio || ""}</p>
                <p class = location>${userData.location || ""}</p>
       </div>
      
    `

    profile.innerHTML = profilePhoto

}

const appendRepos = async(repos) =>{
  document.querySelector(".repos").innerHTML = "";
  repos.forEach((repo) =>{
       const div = document.createElement("div");
       const heading = document.createElement("p");
       const desc = document.createElement("p");
       const button = document.createElement("button");
       button.innerText = repo.language;
       button.classList.add("button");
       heading.innerText = repo.name.replace("-"," ");
       heading.classList.add("heading");
       desc.innerText = repo.description;
       div.appendChild(heading);
       div.appendChild(desc);
       div.appendChild(button);
       div.classList.add("repoInfo")
       repoContainer.appendChild(div);

  })
}

const appendPagination = (repoNumber) =>{
     pagination.innerHTML = "";
     let perPage = 0;
     const pages = document.createElement("div");
     pages.classList.add("pageButtonContainer");
     let count =1;
     let incr = 10;
     while(perPage<=repoNumber || repoNumber-perPage>0){
          const temp = document.createElement("button");
          temp.classList.add("pageButton");
          temp.innerText = count;
          if(perPage===0){
            temp.classList.add("active");
          }
          temp.addEventListener("click" ,(e) =>{
            document.querySelectorAll(".pageButton").forEach((button) =>{
              button.classList.remove("active");
            });
            e.target.classList.add("active");
            fetchMoreRepos(e.target.innerText);

          });
          perPage+=incr;
          console.log(temp);
          count++;
          pages.appendChild(temp);
     }

     pagination.appendChild(pages);
  

}

const fetchMoreRepos = async (page) =>{
     const response = await fetch(`/navigate/${user}/${page}`);
     const newRepo = await response.json();
     console.log(newRepo);
     appendRepos(newRepo.repos);
}



