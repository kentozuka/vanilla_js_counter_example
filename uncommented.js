const storageName = 'data'

// counter class: represents the counter
class Counter {
  constructor(title, desc) {
    this.title = title
    this.desc = desc
    this.counter = 0
  }

  create() {
    const li = document.createElement('li')
    li.classList.add('counter-item')
    li.innerHTML = `
      <h3>${this.title}</h3>
      <p>${this.desc}</p>
      <p class="sm-counter" style="text-align: center; font-weight: bold;">${this.counter}</p>
    `
    const hol = document.createElement('div')
    hol.className = 'buttons'
    const minus = Counter.createBtn('btn-blue', '-', this.update)
    const plus = Counter.createBtn('btn-blue', '+', this.update)
    hol.append(minus, plus)

    li.append(hol)
    return li
  }

  update(e) {
    const { target } = e
    const li = target.parentNode.parentNode
    const cnt = li.querySelector('.sm-counter')
    if (target.innerText === '+') cnt.innerText = ++cnt.innerText
    else cnt.innerText = --cnt.innerText
  }

  static createBtn(cls, txt, fn) {
    const btn = document.createElement('button')
    btn.className = cls
    btn.innerText = txt
    btn.addEventListener('click', fn)
    return btn
  }
}

// UI class: responsible for ui stuff
class UI {
  static show() {
    const counters = Store.read()
    counters.forEach(({ title, desc }) => {
      const cnt = new Counter(title, desc)
      UI.append(cnt.create())
      UI.hideEmpty()
    })
  }

  static append(li) {
    const holder = document.getElementById('target')
    holder.appendChild(li)
  }

  static clearForm() {
    document.querySelector('#modal input[name="title"]').value = ''
    document.querySelector('#modal input[name="description"]').value = ''
  }

  static clearLists() {
    const holder = document.getElementById('target')
    holder.innerHTML = ''
  }

  static warn() {
    const message = 'Please fill in both fileds'
    window.alert(message)
  }

  static confirm() {
    const msg = 'Are you sure you want to reset?'
    return window.confirm(msg)
  }

  static toggleModal() {
    document.getElementById('modal').classList.toggle('hidden')
  }

  static showEmptry() {
    document.getElementById('empty')
      .classList.remove('hidden')
    document.getElementById('target')
      .classList.add('hidden')
  }

  static hideEmpty() {
    document.getElementById('empty')
      .classList.add('hidden')
    document.getElementById('target')
      .classList.remove('hidden')
  }
}

// Store class: store using localstorage
class Store {
  static add(counter) {
    const tmp = Store.read()
    tmp.push(counter)
    Store.save(tmp)
  }

  static read() {
    const localData = localStorage.getItem(storageName)
    if (localData) return JSON.parse(localData)
    return []
  }

  static clear() {
    localStorage.removeItem(storageName)
  }

  static save(data) {
    const dataString = JSON.stringify(data)
    localStorage.setItem(storageName, dataString)
  }
}

function toggle() {
  UI.toggleModal()
}

function reset() {
  const confirmed = UI.confirm()
  if (!confirmed) return console.log('cancelled!!')

  Store.clear()
  UI.clearForm()
  UI.clearLists()
  UI.showEmptry()
}


function addCounter(e) {
  e.preventDefault()

  const title = document.querySelector('#modal input[name="title"]').value
  const desc = document.querySelector('#modal input[name="description"]').value
  if (!(title && desc)) return UI.warn()

  const cntr = new Counter(title, desc)
  UI.append(cntr.create())
  UI.hideEmpty()

  Store.add(cntr)
  UI.clearForm()
  UI.toggleModal()
}

document.addEventListener('DOMContentLoaded', UI.show)