const router = require("express").Router();
const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH,
  });


  const fetchUser = async (username) =>{
    const response = await octokit.request(`GET /users/${username}`, {
        username: `${username}`,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
     console.log(response.data);
     return response.data;
}

const fetchRepos = async (username,per_page=10,page = 1) =>{
  const response = await octokit.request(`GET /users/${username}/repos?per_page=${per_page}&page=${page}`, {
      username: `${username}`,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const repoArray = response.data;
    let repos = [];
    if(repoArray.length>0){
      repoArray.forEach(async (repo) =>{
        // let languages = await fetch(repo.languages_url);
        //  languages= await languages.json();
        // console.log(languages);
        // languages = Object.keys(languages);
        // console.log(languages);
       const info = {
            name:repo.name,
            description:repo.description,
            language:repo.language,
       }
       repos.push(info);
       });
    }
   

    return repos;

}


router.post("/search",async (req,res) =>{
    const username = req.body.name;
    const user = await fetchUser(username);
    const repos = await fetchRepos(username);
    res.status(200).json({user,repos});
});

router.get("/navigate/:username/:page",async (req,res) =>{
       const {username,page} = req.params;
       console.log(username,page);
       const repos = await fetchRepos(username,10,page);
       res.status(200).json({repos});
});


module.exports = router;