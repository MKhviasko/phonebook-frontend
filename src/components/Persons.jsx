const Persons = ({ filteredPersons }) => {
    return (
        <div>
            {filteredPersons.map((person, i) => <div key={i}>{person.name} {person.number}</div>)}
        </div>
    )
}

export default Persons