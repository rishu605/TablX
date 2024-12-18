import React, { useEffect, useState, Fragment } from "react"
import { getProjectDetailsFromApi } from "../../api/api"
import "./Table.css"

interface TableProps {}

interface ProjectDetails {
    "s.no": number;
    "amt.pledged": number;
    "percentage.funded": number;
}

const Table: React.FC<TableProps> = () => {
    const [projectDetails, setProjectDetails] = useState<ProjectDetails[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageGroup, setCurrentPageGroup] = useState(0)
    const recordsPerPage = 5
    const pagesPerGroup = 5
    const [err, setErr] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const apiData = await getProjectDetailsFromApi()
                setProjectDetails(apiData)
                setIsLoading(false)
            } catch (error) {
                setErr("Failed to fetch project details")
                console.error("Failed to fetch project details:", error)
                setIsLoading(false)
            }
        }

        fetchProjectDetails()
    }, [])

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        setCurrentPageGroup(Math.floor((pageNumber - 1) / pagesPerGroup))
    }

    const handleNextPageGroup = () => {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        if (nextPage > (currentPageGroup + 1) * pagesPerGroup) {
            setCurrentPageGroup(currentPageGroup + 1)
        }
    }

    const handlePreviousPageGroup = () => {
        const prevPage = currentPage - 1
        setCurrentPage(prevPage)
        if (prevPage <= currentPageGroup * pagesPerGroup) {
            setCurrentPageGroup(currentPageGroup - 1)
        }
    }

    const renderProjectDetails = () => {
        const currentPageDetails = projectDetails.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
        return currentPageDetails
            .map(item => (
                <tr role="row" key={item["s.no"]}>
                    <td role="cell" className="col-width-small">{item["s.no"]}</td>
                    <td role="cell">{item["percentage.funded"]}</td>
                    <td role="cell">{item["amt.pledged"]}</td>
                </tr>
            ))
    }

    const renderTable = () => (
        <table role="table" className="styled-table" aria-label="Project details">
            <thead>
                <tr role="row">
                    <th scope="col" className="col-width-small">S.No.</th>
                    <th scope="col">Percentage funded</th>
                    <th scope="col">Amount pledged</th>
                </tr>
            </thead>
            <tbody>
                {renderProjectDetails()}
            </tbody>
        </table>
    )

    const renderPagination = () => {
        const totalPages = Math.ceil(projectDetails.length / recordsPerPage)
        const startPage = currentPageGroup * pagesPerGroup + 1
        const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)

        return (
            <div className="pagination">
                <button role="button" aria-label="Previous Page/Group" disabled={currentPage === 1} onClick={handlePreviousPageGroup}>{"<"}</button>
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                    <button
                        key={startPage + index}
                        onClick={() => handlePageChange(startPage + index)}
                        className={currentPage === startPage + index ? "active" : ""}
                    >
                        {startPage + index}
                    </button>
                ))}
                <button aria-label="Next Page/Group" disabled={currentPage === totalPages} onClick={handleNextPageGroup}>{">"}</button>
            </div>
        )
    }

    const renderLoader = () => (
        <div className="loader">
            Loading...
        </div>
    )


    return (
        <main className="table-container">
            <h2 role="heading" aria-level={2}>Project Details</h2>
            {isLoading ? (
                renderLoader() // Show loader if data is being fetched
            ) : err ? (
                <div role="alert" className="error-message">
                    {err}
                </div>
            ) : (
                <Fragment>
                    {renderTable()}
                    {renderPagination()}
                </Fragment>
            )}
        </main>
    )
}

export default Table