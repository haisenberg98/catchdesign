'use client';

import { useEffect, useState } from 'react';

import type { GitHubRepository } from '@/types/github';

import RepositoryCard from './RepositoryCard';
import { MdChevronLeft, MdChevronRight, MdError } from 'react-icons/md';

const RepositoryList = () => {
    // State management
    const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const REPOS_PER_PAGE = 10;
    const API_URL = 'https://api.github.com/orgs/github/repos';

    // Fetch repositories from GitHub API whenever page changes
    useEffect(() => {
        const fetchRepositories = async () => {
            setLoading(true);
            setError(null);

            try {
                // call GitHub API
                const response = await fetch(`${API_URL}?sort=name&per_page=${REPOS_PER_PAGE}&page=${currentPage}`);

                // Check if request was successful
                if (!response.ok) {
                    throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
                }

                // parse JSON response
                const data: GitHubRepository[] = await response.json();

                // update state
                setRepositories(data);
                // if we got less than REPOS_PER_PAGE, there are no more pages
                setHasMore(data.length === REPOS_PER_PAGE);
            } catch (err) {
                // Handle errors
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [currentPage]); // re-run when currentPage changes

    // go to previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Go to next page
    const handleNextPage = () => {
        if (hasMore) {
            // only go to next page if there are more repos
            setCurrentPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // show loading state
    if (loading) {
        return (
            <div className='mx-auto max-w-screen-xl p-6'>
                <div
                    className='flex min-h-[400px] flex-col items-center justify-center px-6 py-16'
                    role='status'
                    aria-live='polite'>
                    <div
                        className='h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-blue-400'
                        aria-hidden='true'></div>
                    <p className='mt-4 text-base text-gray-400'>Loading repositories...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className='mx-auto max-w-screen-xl p-6'>
                <div
                    className='flex min-h-[400px] flex-col items-center justify-center px-6 py-16 text-center'
                    role='alert'>
                    <MdError className='mb-4 h-12 w-12 text-red-400' aria-hidden='true' />
                    <h2 className='mb-2 text-2xl font-semibold text-white'>Error Loading Repositories</h2>
                    <p className='mb-6 max-w-lg text-base text-gray-400'>{error}</p>
                    <button
                        className='rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2'
                        onClick={() => setCurrentPage(1)}
                        aria-label='Retry loading repositories'>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // main content

    return (
        <div className='mx-auto max-w-screen-xl p-6'>
            {/* Header section */}
            <header className='mb-8 text-center'>
                <h1 className='mb-2 text-3xl font-semibold text-white'>GitHub Repositories</h1>
                <p className='text-base text-gray-400'>Showing repositories from the GitHub organization</p>
            </header>

            <main className='mx-auto max-w-4xl'>
                {/* Repository list */}
                <ul className='mb-8 list-none'>
                    {repositories.map((repo) => (
                        <li key={repo.id}>
                            <RepositoryCard repository={repo} />
                        </li>
                    ))}
                </ul>

                {/* show message if no repos found */}
                {repositories.length === 0 && (
                    <div className='px-6 py-16 text-center text-gray-400'>
                        <p>No repositories found.</p>
                    </div>
                )}

                {/* Pagination controls */}
                <nav
                    className='flex items-center justify-center gap-4 border-t border-gray-700 py-6'
                    aria-label='Pagination'>
                    {/* previous button */}
                    <button
                        className='flex items-center gap-1.5 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all hover:border-blue-500 hover:bg-gray-800 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        aria-label='Go to previous page'>
                        <MdChevronLeft className='h-4 w-4' aria-hidden='true' />
                        Previous
                    </button>

                    {/* current page indicator */}
                    <span className='min-w-[80px] text-center text-sm font-medium text-white' aria-live='polite'>
                        Page {currentPage}
                    </span>

                    {/* Next button */}
                    <button
                        className='flex items-center gap-1.5 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all hover:border-blue-500 hover:bg-gray-800 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        onClick={handleNextPage}
                        disabled={!hasMore}
                        aria-label='Go to next page'>
                        Next
                        <MdChevronRight className='h-4 w-4' aria-hidden='true' />
                    </button>
                </nav>
            </main>
        </div>
    );
};

export default RepositoryList;
