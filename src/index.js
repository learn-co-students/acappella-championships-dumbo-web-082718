document.addEventListener('DOMContentLoaded', () => {
  getGroups();
  const winner = document.querySelector('#winner')
  let tableBody = document.querySelector('tbody')

  function getGroups() {
    fetch('http://localhost:3000/a_cappella_groups')
      .then(res => res.json())
      .then(json => json.forEach(group => showGroup(group)))
  }

  function showGroup(group) {
    const tr = document.createElement('tr');
    tr.id = `group-${group.id}`
    const college = document.createElement('td')
    college.innerText = group.college.name
    const groupName = document.createElement('td')
    groupName.innerText = group.name
    const membership = document.createElement('td')
    membership.innerText = group.membership
    const division = document.createElement('td')
    division.innerText = group.college.division
    const trophy = document.createElement('td')
    const img = document.createElement('img')
    img.src = './assets/trophy.png';
    img.dataset.indexNumber = group.id
    const deleteTd = document.createElement('td')
    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete'
    deleteButton.className = 'btn btn-danger'
    deleteButton.addEventListener('click', e => deleteGroup(e))
    img.addEventListener('click', e => crownWinner(e, group))
    trophy.append(img)
    deleteTd.append(deleteButton)
    tr.append(college, groupName, membership, division, trophy, deleteTd)
    tableBody.append(tr)
  }

  const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

  document.querySelectorAll('th').forEach(th => [`Crown as Winner`, 'Delete'].includes(th.innerText) ? null : th.addEventListener('click', (() => {
    console.log('clickies')
    Array.from(tableBody.children)
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tableBody.appendChild(tr) );
        console.log(th)
  })));

  function crownWinner(e, group) {
    if (winner.value) {
      const oldWinner = document.querySelector(`#group-${winner.value}`)
      oldWinner.hidden = false
    }
    const newWinner = document.querySelector(`#group-${group.id}`)
    newWinner.hidden = true
    winner.value = group.id
    winner.innerText = `Winner: ${group.name}`
  }

  function deleteGroup(e) {
    let num = parseInt(e.target.parentNode.parentNode.id.split('-')[1])
    console.log(num)
    // fetch(`http://localhost:3000/a_cappella_groups/${num}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })

    e.target.parentNode.parentNode.remove();
  }
})
