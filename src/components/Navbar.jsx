import { useEffect } from 'react';
import avatarImg from '../assets/img/dr_umar.png';
import { store, useStore } from '../store';

function Navbar() {
    const { signedIn } = useStore();
    useEffect(() => {
        window.HSStaticMethods?.autoInit();
    });

    const closeDropdown = () => {
        const container = document.getElementById('dropdown-scrollable')?.closest('.dropdown');
        if (container) window.HSDropdown?.getInstance(container)?.close();
    };

    return (
        <>
            <nav className="navbar rounded-t-box gap-4">
                <div className="navbar-start items-center">
                    <a className="link text-base-content link-neutral text-xl font-bold no-underline" href="#">
                        FlyonUI
                    </a>
                </div>
                <div className="navbar-center">
                    <ul className="menu menu-horizontal gap-2 text-md [&>li>a]:py-2">
                        <li><a href="#">Link 1</a></li>
                        <li><a href="#">Link 2</a></li>
                        <li><a href="#">Link 3</a></li>
                    </ul>
                </div>
                <div className="navbar-end flex items-center gap-4">
                    <button className="btn btn-sm btn-text btn-circle size-8.5 md:hidden">
                        <span className="icon-[tabler--search] size-5.5"></span>
                    </button>
                    <div className="input input-sm max-md:hidden rounded-full max-w-56">
                        <span className="icon-[tabler--search] text-base-content/80 my-auto me-2 size-4 shrink-0"></span>
                        <label className="sr-only" htmlFor="submenuInput">Full Name</label>
                        <input type="search" className="grow text-sm" placeholder="Search" id="submenuInput" />
                    </div>
                    <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                        <button id="dropdown-scrollable" type="button" className="dropdown-toggle flex items-center" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                            <div className="avatar">
                                <div className="size-8 rounded-full">
                                    <img src={avatarImg} alt="Dr. Umar" />
                                </div>
                            </div>
                        </button>
                        <ul className="dropdown-menu dropdown-open:opacity-100 hidden min-w-48" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-avatar">
                            <li className="dropdown-header gap-2 border-0 py-1 px-3">
                                <div className="avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={avatarImg} alt="Dr. Umar" />
                                    </div>
                                </div>
                                <div>
                                    <h6 className="text-base-content text-sm font-semibold">Dr. Muhammad Umar Siddique</h6>
                                    <small className="text-base-content/50">Admin</small>
                                </div>
                            </li>
                            <li><hr className="border-base-content/25 -mx-2 " /></li>
                            <li>
                                <a className="dropdown-item py-1.5 text-sm" href="#" onClick={closeDropdown}>
                                    <span className="icon-[tabler--user]"></span>
                                    My Profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item py-1.5 text-sm" href="#" onClick={closeDropdown}>
                                    <span className="icon-[tabler--settings]"></span>
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item py-1.5 text-sm" href="#" onClick={closeDropdown}>
                                    <span className="icon-[tabler--receipt-rupee]"></span>
                                    Billing
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item py-1.5 text-sm" href="#" onClick={closeDropdown}>
                                    <span className="icon-[tabler--help-triangle]"></span>
                                    FAQs
                                </a>
                            </li>
                            <li><hr className="border-base-content/25 -mx-2" /></li>
                            <li>
                                <a href="#" onClick={() => { closeDropdown(); signedIn ? store.getState().signOut() : store.getState().signIn(); }}
                                className="dropdown-item py-1.5 text-sm text-error hover:bg-error/10" >
                                    <span className="icon-[tabler--logout]"></span>
                                    {signedIn ? 'Sign out' : 'Sign in'}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar