        const fetch = require("node-fetch");


    function renderBadges(username, repo, license) {
  let ret = ""
  ret += `
![Analysis](https://img.shields.io/github/languages/top/${username}/${repo})`
  if (license) {
    ret += `
![License](https://img.shields.io/github/license/${username}/${repo})
  `
  }
  return ret
}

    const generateLicenseSection = async (github, repo) => {
  let ret = ""
  await fetch("https://api.github.com/repos/" + github + "/" + repo)
    .then(async response => {
      if (response.ok) {
        await response.json()
          .then(async data => {
            ret += await data.license.name
          });
      };
    });
    return ret;
}


    const generateMarkdown = async data => {
  console.log("GENERATE MARKDOWN!")
  console.log(data)

  let addSections = "";

  if (data.title) { 
    addSections += `# ${data.title}
`
  }

  
  if (data.github && data.title) { 
    addSections += `
https://github.com/${data.github}
`
  }
  
  
  addSections += `${renderBadges(data.github, data.repo, data.license)}`

  
  if (data.description) {
    addSections += `
## Description
${data.description}
`
  }

  addSections += tableOContents(data)

  if (data.installation) {
    addSections += `
## Installation
${data.installation}
`
  }

  if (data.usage) {
    addSections += `
## Usage
${data.usage}
`
  }

  if (data.license) { 

    addSections += `

    ${await generateLicenseSection(data.github, data.repo)} 
`
    console.log(await generateLicenseSection(data.github, data.repo))
  }

  if (data.contributing) {
    addSections += `
${data.contributing}
`
  }

  if (data.tests) {
    addSections += `
${data.tests}
`
  }
  if (data.email) {
    addSections += `


${data.email}
`
  }
  console.log(addSections)
  return addSections
};

function tableOContents(data) {
  const content = (Object.entries(data))
  let ret = "";
  let i = 2; 
  ret += `
`
  while (content[i][0] != 'github') {
    let header = content[i][0].charAt(0).toUpperCase() + content[i][0].slice(1);
    ret += `
* [${header}](#${content[i][0]})`
    i++;
  }
  ret += `
`
  return ret;
}

module.exports = generateMarkdown;