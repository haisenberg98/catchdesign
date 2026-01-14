import { formatDate, formatNumber } from '@/app/lib/utils';
import type { GitHubRepository } from '@/types/github';

import { AiOutlineFork, AiOutlineStar } from 'react-icons/ai';
import { GoLaw } from 'react-icons/go';

interface RepositoryCardProps {
    repository: GitHubRepository;
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
    return (
        <article className='mb-4 rounded-md border border-gray-700  p-4 transition-colors hover:border-blue-500 focus-within:border-blue-500 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2'>
            {/* repository name and visibility badge */}
            <div className='mb-2 flex items-center gap-2'>
                <h2 className='text-xl font-semibold'>
                    <a
                        href={repository.html_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='break-words text-blue-400 no-underline hover:underline focus:rounded focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2'
                        aria-label={`View ${repository.name} repository on GitHub`}>
                        {repository.name}
                    </a>
                </h2>
                {repository.visibility && (
                    <span className='rounded-full border border-gray-700 bg-transparent px-2 py-0.5 text-xs font-medium capitalize text-gray-400'>
                        {repository.visibility}
                    </span>
                )}
            </div>

            {/* show description if it exists */}
            {repository.description && <p className='mb-3 text-sm leading-6 text-gray-400'>{repository.description}</p>}

            {/* Show topics/tags (max 5) */}
            {repository.topics && repository.topics.length > 0 && (
                <div className='mb-3 flex flex-wrap gap-1'>
                    {repository.topics.slice(0, 5).map((topic) => (
                        <span
                            key={topic}
                            className='rounded-full bg-blue-900/20 px-2 py-0.5 text-xs font-medium text-blue-400'>
                            {topic}
                        </span>
                    ))}
                </div>
            )}

            {/* repository stats: language, stars, forks, license, updated date */}
            <div className='flex flex-wrap items-center gap-4 text-xs text-gray-400'>
                {/* show programming language if available */}
                {repository.language && (
                    <span className='flex items-center gap-1'>
                        <span className='h-3 w-3 rounded-full bg-yellow-400' aria-hidden='true'></span>
                        {repository.language}
                    </span>
                )}

                {/* Show star count if greater than 0 */}
                {repository.stargazers_count > 0 && (
                    <span className='flex items-center gap-1'>
                        <AiOutlineStar className='h-4 w-4' aria-hidden='true' />
                        {formatNumber(repository.stargazers_count)}
                    </span>
                )}

                {/* show fork count if available */}
                {repository.forks_count > 0 && (
                    <span className='flex items-center gap-1'>
                        <AiOutlineFork className='h-4 w-4' aria-hidden='true' />
                        {formatNumber(repository.forks_count)}
                    </span>
                )}

                {/* show license if available */}
                {repository.license && (
                    <span className='flex items-center gap-1'>
                        <GoLaw className='h-4 w-4' aria-hidden='true' />
                        {repository.license.spdx_id}
                    </span>
                )}

                {/* Show when the repo was last updated */}
                <span className='flex items-center gap-1'>{formatDate(repository.updated_at)}</span>
            </div>
        </article>
    );
};

export default RepositoryCard;
