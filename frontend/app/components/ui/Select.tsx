import { useState } from 'react'
import { useFocus } from '../utils'
import { Icon } from '.'

import type { ChangeEvent, Dispatch, SetStateAction, RefObject } from 'react'

interface Props {
    items: string[]
    activeItems: Set<string>
    setActiveItems: Dispatch<SetStateAction<Set<string>>>
    placeholderText?: string
    isSingleChoice?: boolean
}

export function Select({
    items,
    activeItems,
    setActiveItems,
    placeholderText = 'Choose an item',
    isSingleChoice = false,
}: Props) {
    const [filteredItems, setFilteredItems] = useState<string[]>(items)
    const [textFilter, setTextFilter] = useState<string>('')
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [inputRef, setInputFocus, unsetInputFocus] =
        useFocus<HTMLInputElement>()

    const toggleIsActive = (item: string) => {
        if (getIsActive(item)) {
            const activeItemsTmp = new Set(activeItems)
            activeItemsTmp.delete(item)
            setActiveItems(activeItemsTmp)
        } else {
            setActiveItems(new Set([...activeItems, item]))
        }
    }

    const changeIsActive = (item: string) => {
        setActiveItems(new Set([item]))
        setIsOpened(false)
        setTextFilter('')
        unsetInputFocus()
    }

    const getIsActive = (item: string) => activeItems.has(item)

    const filterHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setTextFilter(text)
        setFilteredItems(
            items.filter((item) =>
                item.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

    const clearFilter = () => {
        setFilteredItems(items)
        setTextFilter('')
    }

    return (
        <div className="flex flex-col w-fit h-fit">
            <div className="relative">
                <Input
                    textFilter={textFilter}
                    filterHandler={filterHandler}
                    setIsOpened={setIsOpened}
                    clearFilter={clearFilter}
                    isOpened={isOpened}
                    placeholderText={placeholderText}
                    inputRef={inputRef}
                    setInputFocus={setInputFocus}
                    unsetInputFocus={unsetInputFocus}
                />
                <div
                    className={`absolute shadow top-full z-40 w-full left-0 rounded max-h-40 overflow-x-hidden overflow-y-scroll 
                        ${isOpened ? 'block' : 'hidden'}`}
                >
                    <div className="flex flex-col w-full divide-y divide-appRowDivider">
                        {filteredItems.map((d, i) => (
                            <Item
                                key={i}
                                name={d}
                                toggleIsActive={
                                    isSingleChoice
                                        ? changeIsActive
                                        : toggleIsActive
                                }
                                isActive={getIsActive(d)}
                                isSingleChoice={isSingleChoice}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface InputProps {
    textFilter: string
    filterHandler: (e: ChangeEvent<HTMLInputElement>) => void
    setIsOpened: Dispatch<SetStateAction<boolean>>
    clearFilter: () => void
    isOpened: boolean
    placeholderText: string
    inputRef: RefObject<HTMLInputElement>
    setInputFocus: () => void | undefined
    unsetInputFocus: () => void | undefined
}

function Input({
    textFilter,
    filterHandler,
    setIsOpened,
    clearFilter,
    isOpened,
    placeholderText,
    inputRef,
    setInputFocus,
    unsetInputFocus,
}: InputProps) {
    const isFiltering = textFilter.length > 0

    return (
        <div className="w-60">
            <div className="my-2 bg-white p-1 flex border border-gray-200 rounded">
                <div className="flex flex-auto flex-wrap"></div>
                <input
                    ref={inputRef}
                    value={textFilter}
                    className="p-1 px-2 appearance-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
                    placeholder={`${placeholderText}...`}
                    onChange={filterHandler}
                    onFocus={() => setIsOpened(true)}
                    onBlur={() => setIsOpened(false)}
                />
                <div>
                    {isFiltering ? (
                        <button
                            className="cursor-pointer w-6 h-full flex items-center text-gray-400 outline-none focus:outline-none"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={clearFilter}
                        >
                            <Icon type="cross" />
                        </button>
                    ) : null}
                </div>
                <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
                    <button
                        className={`cursor-pointer w-6 h-6 text-gray-500 outline-none focus:outline-none 
                            ${isOpened ? '-rotate-180' : 'rotate-0'}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (!isOpened) setInputFocus()
                            else unsetInputFocus()

                            setIsOpened(!isOpened)
                        }}
                    >
                        <Icon type="arrowDown" />
                    </button>
                </div>
            </div>
        </div>
    )
}

interface ItemProps {
    name: string
    isActive: boolean
    isSingleChoice: boolean
    toggleIsActive: (name: string) => void
}

function Item({ name, isActive, isSingleChoice, toggleIsActive }: ItemProps) {
    return (
        <div
            role="checkbox"
            tabIndex={0}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggleIsActive(name)}
            onKeyDown={() => null}
            aria-checked="true"
            className={`cursor-pointer flex w-full items-center p-2 relative 
                ${isActive && !isSingleChoice ? 'bg-gray-500 hover:bg-gray-400 text-gray-50' : 'bg-white hover:bg-gray-200'}`}
        >
            <div className="w-full items-center flex">
                <div className="mx-2 leading-5 text-sm">{name}</div>
            </div>
        </div>
    )
}
