import Image from "next/image";
import {
    BriefcaseIcon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    MapPinIcon,
    LinkIcon,
    PencilIcon,
} from '@heroicons/react/24/solid'

export default function Header() {
    return (
        <>
            <div className={"bg-stone-900 py-5 px-10"}>
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="flex-1 min-w-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol role="list" className="flex items-center space-x-4">
                                <li>
                                    <div className="flex">
                                        <a href="#" className="text-sm font-medium text-gray-300 hover:text-white">
                                            Jobs
                                        </a>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="flex-shrink-0 h-5 w-5 text-white-500" aria-hidden="true" />
                                        <a href="#" className="ml-4 text-sm font-medium text-gray-300 hover:text-white">
                                            Engineering
                                        </a>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                        <h2 className="mt-2 text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate"
                            style={{height: 40}}
                        >
                            Darie-Dragoș Mitoiu - SecuriGroup Software Developer Assessment
                        </h2>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-300">
                                <BriefcaseIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-white-500" aria-hidden="true" />
                                Full-time
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-300">
                                <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-white-500" aria-hidden="true" />
                                Remote
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-300">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-white-500" aria-hidden="true" />
                                Closing on 23 October, 2025
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
