import { DateTime } from 'luxon'
import { autorun, makeAutoObservable, observable, runInAction } from 'mobx'
import { Agenda, Cinema, fetchAgenda, fetchCinemas, Film, FilmEvent, getUniqueAttributes, mergeAgenda } from './data'

export class ToggleList {
  activeSet: Set<string> = new Set<string>()
  allowed: string[] = []

  get list() {
    return [...this.activeSet]
  }

  constructor() {
    makeAutoObservable(this)
    autorun(() => {
      if (this.allowed.length !== 0) {
        this.list.filter((i) => !this.allowed.includes(i)).forEach((i) => this.activeSet.delete(i))
      }
    })
  }

  toggle(item: string) {
    this.activeSet.has(item) ? this.activeSet.delete(item) : this.activeSet.add(item)
  }

  clear() {
    this.activeSet.clear()
  }

  has(item: string) {
    return this.activeSet.size !== 0 ? this.activeSet.has(item) : null
  }

  everyPresentIn(items: string[]) {
    if (this.activeSet.size === 0) {
      return true
    }
    return this.list.every((item) => items.includes(item))
  }
}

export class AppStore {
  emptyAgenda: Agenda = { films: [], events: [] }
  cinemas: Cinema[] = []
  cinema = '1132'
  films: Film[] = []
  events: FilmEvent[] = []

  get agenda(): Agenda {
    return { films: this.films, events: this.events }
  }

  get dates() {
    const workingDates = []
    for (let i = 0; i < 7; i++) {
      workingDates.push(DateTime.local().plus({ days: i }).toFormat('yyyy-MM-dd'))
    }
    return workingDates
  }

  get uniqueAttributes() {
    return getUniqueAttributes(this.agenda)
  }

  get activeCinema() {
    return this.cinemas.find((c) => c.id === this.cinema)
  }

  get possibleExcluded() {
    return this.uniqueAttributes.filter((a) => !this.included.has(a))
  }

  get possibleOptions() {
    return this.uniqueAttributes.filter((a) => !this.included.has(a) && !this.excluded.has(a))
  }

  activeDates = new ToggleList()
  activeFilms = new ToggleList()

  included = new ToggleList()
  excluded = new ToggleList()

  optionA = new ToggleList()
  optionB = new ToggleList()
  optionC = new ToggleList()

  get filteredEvents() {
    console.time()
    const e = this.agenda.events
      .filter((e) => this.activeDates.has(e.businessDay) ?? true)
      .filter((e) => this.activeFilms.has(e.filmId) ?? true)
      .filter((e) => this.included.everyPresentIn(e.attributeIds))
      .filter((e) => e.attributeIds.every((i) => !this.excluded.has(i)))
      .filter((e) => [this.optionA, this.optionB, this.optionC].some((o) => o.everyPresentIn(e.attributeIds)))
    console.timeEnd()
    return e
  }

  get filteredEventSet() {
    return new Set<FilmEvent>(this.filteredEvents)
  }

  get eventsOfDate() {
    const obj: Record<string, FilmEvent[]> = {}
    this.dates.forEach((d) => (obj[d] = this.filteredEvents.filter((e) => e.businessDay === d)))
    return obj
  }

  constructor() {
    makeAutoObservable(this, {
      films: observable.shallow,
      events: observable.shallow,
    })
    this.loadCinemas()
    this.loadAgenda()
    autorun(() => {
      runInAction(() => {
        this.included.allowed = this.uniqueAttributes
        this.excluded.allowed = this.possibleExcluded
        this.optionA.allowed = this.possibleOptions
        this.optionB.allowed = this.possibleOptions
        this.optionC.allowed = this.possibleOptions
      })
    })
  }

  async loadCinemas() {
    const response = await fetchCinemas()
    runInAction(() => {
      this.cinemas = response.cinemas
    })
  }

  async loadAgenda() {
    this.films = []
    this.events = []
    const agendas = await Promise.all(this.dates.map((d) => fetchAgenda(d, this.cinema)))
    console.log('Agendas loaded')
    runInAction(() => {
      const agenda = agendas.reduce(mergeAgenda)
      this.films = agenda.films
      this.events = agenda.events
    })
  }

  clear() {
    this.activeDates.clear()
    this.activeFilms.clear()
    this.included.clear()
    this.excluded.clear()
    this.optionA.clear()
    this.optionB.clear()
    this.optionC.clear()
  }

  setCinema(cinema: string) {
    this.cinema = cinema
    this.loadAgenda()
  }
}
