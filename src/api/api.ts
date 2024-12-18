const getProjectDetailsFromApi = async () => {
    const apiUrl = "htts://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
    try {
        const response = await fetch(apiUrl)
        if(!response) {
            throw new Error("Error getting data")
        }

        const data = await response.json()
        if(!data) {
            throw new Error("Error parsing JSON data")
        }
        return data
    } catch(err) {
        // console.error("Failed to get project details", err)
        throw err
    }
}

export {
    getProjectDetailsFromApi
}