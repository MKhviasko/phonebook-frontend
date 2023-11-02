const RemovePersonForm = ({
  removePersonHandler,
  personName,
  handlePersonNameChange }) => {
  return (
    <form onSubmit={removePersonHandler}>
      <div>
        name: <input value={personName} onChange={handlePersonNameChange} />
      </div>
      <div>
        <button type="submit">remove</button>
      </div>
    </form>
  )
}

export default RemovePersonForm