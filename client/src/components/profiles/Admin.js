import Nav from '../common/Nav'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getToken, getUserID } from '../../helpers/auth'
import { v4 as uuid } from 'uuid'

const Admin = () => {

  // const uuid = uuid()
  const [error, setError] = useState('')
  const [adminData, setAdminData] = useState({})
  const [editedDestinations, setEditedDestinations] = useState([])
  const [adminDestinations, setAdminDestinations] = useState([])
  const [deleteId, setDeleteID] = useState({
    id: '',
  })
  const [editId, setEditID] = useState('')
  const [addId, setAddId] = useState('')
  const [editBody, setEditBody] = useState({
    name: '',
    country: '',
    continent: '',
    currency: '',
    latitude: '',
    longitude: '',
    description: '',
    images: [],
    features: [],
    highTemps: [],
    lowTemps: [],
    reviews: [],
    id: '',
    owner: getUserID(),
  })
  const [addBody, setAddBody] = useState({
    name: '',
    country: '',
    continent: '',
    currency: '',
    latitude: '',
    longitude: '',
    description: '',
    images: [],
    features: [],
    highTemps: [],
    lowTemps: [],
    id: uuid(),
    owner: getUserID(),
  })

  // ! On Mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get('/api/admin', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('ADMIN OBJECT ->', data)
        const { Destinations } = data
        setAdminData(Destinations)
        setAdminDestinations(Destinations)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [addId, editedDestinations])

  useEffect(() => {
    if (deleteId.id === '') return
    const deleteDestination = async () => {
      try {
        await axios.delete('/api/admin', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          data: {
            id: deleteId,
          },
        })
        const updatedDestinations = adminDestinations.filter(destination => destination.id !== deleteId)
        setAdminDestinations(updatedDestinations)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
      displayDetinations()
    }
    deleteDestination()
  }, [deleteId])

  const handleDelete = (value) => {
    setDeleteID(value)
  }

  const handleEdit = (value) => {
    const destination = adminData.filter(destination => destination.id === value)[0]
    console.log('DESTINATION ->', destination)
    const { name, country, continent, currency, latitude, longitude, description, images, features, highTemps, lowTemps, reviews } = destination
    console.log('DESTINATION ->', destination)
    setEditBody({
      name: name,
      country: country,
      continent: continent,
      currency: currency,
      latitude: latitude,
      longitude: longitude,
      description: description,
      images: images.join(','),
      features: features.join(','),
      highTemps: highTemps.join(','),
      lowTemps: lowTemps.join(','),
      reviews: reviews,
      id: value,
      owner: getUserID(),
    })
    openEditModal('edit')
    setEditID(value)
  }

  const handleAdd = () => {
    setAddBody({
      name: '',
      country: '',
      continent: '',
      currency: '',
      latitude: '',
      longitude: '',
      description: '',
      images: [],
      features: [],
      highTemps: [],
      lowTemps: [],
      id: uuid(),
      owner: getUserID(),
    })
    openAddModal('add')
  }

  const displayDetinations = () => {
    return (
      adminDestinations &&
      adminDestinations.map((destination, i) => {
        return (
          <div key={i}>
            <div className="individualDestination" >
              <h3>{destination.name}, {destination.country}</h3>
              <div className='destinationDetails'>
                <div className='destinationImageDiv'><img src={destination.images[3]} alt={destination.name} className='destinationImage' /></div>
                <div className='destinationBtns'>
                  <button className='edit' onClick={(e) => handleEdit(e.target.value)} value={destination.id}>Edit</button>
                  <button className='delete' onClick={(e) => handleDelete(e.target.value)} value={destination.id}>Delete</button>
                </div>
              </div>
              <hr />
            </div>
          </div>
        )
      })
    )
  }

  useEffect(() => {
    displayDetinations()
  }, [adminDestinations])

  useEffect(() => {
    console.log('ADMIN DATA ->', adminData)
  }, [adminData])

  // ! Edit Modal functions

  const editModal = useRef(null)
  const addModal = useRef(null)


  const submitEdit = async (e) => {
    console.log('EDIT ID ->', editId)
    console.log(editBody)
    e.preventDefault()
    try {
      await axios.put('/api/admin', editBody,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
      const filteredArray = adminDestinations.filter(destination => destination.id !== editId)
      const updatedDestinations = [...filteredArray, editBody]
      console.log('EDITED DESTINATIONS ARRAY ->', updatedDestinations)
      setAdminDestinations(updatedDestinations)
      setEditedDestinations(updatedDestinations)
      closeEditModal()
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }

  function openEditModal() {
    editModal.current.showModal()
  }

  function closeEditModal() {
    editModal.current.close()
    setError('')
  }

  const handleUpdate = (e) => {
    setEditBody({ ...editBody, [e.target.name]: e.target.value })
    setError('')
  }

  const handleUpdateAdd = (e) => {
    setAddBody({ ...addBody, [e.target.name]: e.target.value })
    setError('')
  }

  // ! Add Modal function
  function openAddModal() {
    addModal.current.showModal()
  }

  function closeAddModal() {
    addModal.current.close()
    setError('')
  }

  const submitAdd = async (e) => {
    console.log('ADD BODY ->', addBody)
    e.preventDefault()
    try {
      await axios.post('/api/admin', addBody,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
      const updatedDestinations = [...adminDestinations, addBody]
      console.log('NEW DESTINATIONS ARRAY ->', updatedDestinations)
      setAdminDestinations(updatedDestinations)
      closeAddModal()
      setAddId(addBody.id)
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }


  return (
    <>
      <Nav />
      <main>
        <div id="grid-header">
          <section id='adminHeader'>
            <div id='adminH1Div'>
              <h1 id='adminH1'>Admin</h1>
            </div>
          </section>
          <div id='headerBtnDiv'>
            <Link to={`/profile/${getUserID()}`} as={Link} className='backToProfile'>← Back to profile</Link>
          </div>
          <div id="#admin-container">
            {adminDestinations &&
              <>
                <section id="destinationsOwned">
                  <div id='yourDestinationsHeader'>
                    <h3>Your destinations:</h3>
                    <button className='add' onClick={(e) => handleAdd(e.target.value)} value='proxy'>Add a destination</button>
                  </div>
                  <div id="destinations-container">
                    {adminDestinations.length > 0 ?
                      displayDetinations()
                      :
                      <div>You don&#39;t own any destinations yet.</div>}
                  </div>
                </section>
              </>
            }
          </div>
        </div>
        <dialog className="editModal" id="editModal" ref={editModal}>
          <h2>Edit destination:</h2>
          <button className="close-button" onClick={closeEditModal}>X</button>
          <form id="editForm" method="dialog" onSubmit={submitEdit}>
            <span>
              <label>Name:</label><input type="text" name="name" placeholder='Destination Name' onChange={handleUpdate} value={editBody.name} />
            </span>
            <span>
              <label>Country:</label><input type="text" name="country" placeholder='Country Name' onChange={handleUpdate} value={editBody.country} />
            </span>
            <span>
              <label>Continent:</label><input type="text" name="continent" placeholder='Continent Name' onChange={handleUpdate} value={editBody.continent} />
            </span>
            <span>
              <label>Currency:</label><input type="text" name="currency" placeholder='Currency' onChange={handleUpdate} value={editBody.currency} />
            </span>
            <span>
              <label>Latitude:</label><input type="text" name="latitude" placeholder='Latitude' onChange={handleUpdate} value={editBody.latitude} />
            </span>
            <span>
              <label>Longitude:</label><input type="text" name="longitude" placeholder='Longitude' onChange={handleUpdate} value={editBody.longitude} />
            </span>
            <span>
              <label>Description:</label><input type="text" name="description" placeholder='Description' onChange={handleUpdate} value={editBody.description} />
            </span>
            <span>
              <label>Images:</label><input name="images" placeholder='Images' onChange={handleUpdate} value={editBody.images} />
            </span>
            <span>
              <label>Features:</label><input name="features" placeholder='Features' onChange={handleUpdate} value={editBody.features} />
            </span>
            <span>
              <label>High Temperatures:</label><input type="text" pattern="^-?\d+(,\s*-?\d+){11}$" name="highTemps" placeholder='Daily average high temp for each month' onChange={handleUpdate} value={editBody.highTemps} />
            </span>
            <span>
              <label>Low Temperatures:</label><input type="text" pattern="^-?\d+(,\s*-?\d+){11}$" name="lowTemps" placeholder='Daily average low temp for each month' onChange={handleUpdate} value={editBody.lowTemps} />
            </span>
            <button id="submitEdit" type="submit">Submit edit</button>
            {error && <p className='text-danger'>{error}</p>}
          </form>
        </dialog>

        <dialog className="editModal" id="editModal" ref={addModal}>
          <h2>Add destination:</h2>
          <button className="close-button" onClick={closeAddModal}>X</button>
          <form id="editForm" method="dialog" onSubmit={submitAdd}>
            <span>
              <label>Name:</label><input type="text" name="name" placeholder='Destination Name' onChange={handleUpdateAdd} value={addBody.name} required />
            </span>
            <span>
              <label>Country:</label><input type="text" name="country" placeholder='Country Name' onChange={handleUpdateAdd} value={addBody.country} required />
            </span>
            <span>
              <label>Continent:</label><input type="text" name="continent" placeholder='Continent Name' onChange={handleUpdateAdd} value={addBody.continent} required />
            </span>
            <span>
              <label>Currency:</label><input type="text" name="currency" placeholder='Currency' onChange={handleUpdateAdd} value={addBody.currency} required />
            </span>
            <span>
              <label>Latitude:</label><input type="text" name="latitude" placeholder='Latitude' onChange={handleUpdateAdd} value={addBody.latitude} required />
            </span>
            <span>
              <label>Longitude:</label><input type="text" name="longitude" placeholder='Longitude' onChange={handleUpdateAdd} value={addBody.longitude} required />
            </span>
            <span>
              <label>Description:</label><input type="text" name="description" placeholder='Description' onChange={handleUpdateAdd} value={addBody.description} required />
            </span>
            <span>
              <label>Images:</label><input type="text" name="images" placeholder='Images' onChange={handleUpdateAdd} value={addBody.images} required />
            </span>
            <span>
              <label>Features:</label><input type="text" name="features" placeholder='Features' onChange={handleUpdateAdd} value={addBody.features} required />
            </span>
            <span>
              <label>High Temperatures:</label><input type="text" pattern="^-?\d+(,\s*-?\d+){11}$" name="highTemps" placeholder='Daily average high temp for each month' onChange={handleUpdateAdd} value={addBody.highTemps} />
            </span>
            <span>
              <label>Low Temperatures:</label><input type="text" pattern="^-?\d+(,\s*-?\d+){11}$" name="lowTemps" placeholder='Daily average low temp for each month' onChange={handleUpdateAdd} value={addBody.lowTemps} />
            </span>
            <button id="submitEdit" type="submit">Submit destination</button>
            {error && <p className='text-danger'>{error}</p>}
          </form>
        </dialog>
      </main >
    </>
  )
}

export default Admin