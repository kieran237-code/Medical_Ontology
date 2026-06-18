// 1. Corrig
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

function Footer() {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="bg-base-200 border-t border-base-300 px-6 py-4">
            <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3'>
                <div className='flex items-center gap-4'>
                    <a 
                        href='https://github.com/kieran237-code/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-base-content/70 hover:text-primary transition-colors'
                        aria-label='Github'
                    >
                        <FaGithub size={40} />
                    </a>

                    <a 
                        href='https://www.linkedin.com/in/kieran-junior-foguem/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-base-content/70 hover:text-primary transition-colors'
                        aria-label='LinkedIn'
                    >
                        <FaLinkedin size={40} />
                    </a>

                     <a 
                        href='mailto:foguemjunior23@gmail.com'
                        className='text-base-content/70 hover:text-primary transition-colors'
                        aria-label='Email'
                    >
                        <FaEnvelope size={40} />
                    </a>
                </div>
                <p className='text-sm text-base-content/70'>
                    <strong className='text'>Kieran Junior Foguem</strong> &copy; {currentYear}. <br /> All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer