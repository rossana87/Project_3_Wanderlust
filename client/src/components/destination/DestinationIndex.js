import Nav from '../common/Nav'

const DestinationIndex = () => {

  return (
    <>
      <Nav />
      <main>
        <h1>Hello World</h1>
        <div id="grid-container">
          <div id="filters">Filters</div>
          <div id="grid">
            <div className="card">
              <div id="destination-name">Barcelona</div>
              <div id="avg-weather">Temp: 26</div>
              <div id="avg-review">Avg rating: 4.5</div>
            </div>
          </div>
          <div className="card">
            <div id="destination-name">London</div>
            <div id="avg-weather">Temp: 12</div>
            <div id="avg-review">Avg rating: 1.5</div>
          </div>
        </div>
      </main>
    </>  
  )

}

export default DestinationIndex