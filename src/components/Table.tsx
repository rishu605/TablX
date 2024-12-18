import React, { useEffect, useState } from "react"
import { getProjectDetailsFromApi } from "../api/api"
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

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const apiData = await getProjectDetailsFromApi()
                setProjectDetails(apiData)
            } catch (error) {
                console.error("Failed to fetch project details:", error)
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
                <tr key={item["s.no"]}>
                    <td className="col-width-small">{item["s.no"]}</td>
                    <td>{item["percentage.funded"]}</td>
                    <td>{item["amt.pledged"]}</td>
                </tr>
            ))
    }

    const renderTable = () => (
        <table className="styled-table">
            <thead>
                <tr>
                    <th className="col-width-small">S.No.</th>
                    <th>Percentage funded</th>
                    <th>Amount pledged</th>
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
                <button disabled={currentPage === 1} onClick={handlePreviousPageGroup}>{"<"}</button>
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                    <button
                        key={startPage + index}
                        onClick={() => handlePageChange(startPage + index)}
                        className={currentPage === startPage + index ? "active" : ""}
                    >
                        {startPage + index}
                    </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={handleNextPageGroup}>{">"}</button>
            </div>
        )
    }

    return (
        <div className="table-container">
            <h2>Project Details</h2>
            {renderTable()}
            {renderPagination()}
        </div>
    )
}

export default Table