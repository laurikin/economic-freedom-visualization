import * as d3 from 'd3'

export interface IRecord {
    year: string
    id: string
    label: string
    x: number
    y: number
}

export interface IData {
    years: number[]
    countries: string[]
    data: IRecord[][]
    xDomain: [number, number],
    yDomain: [number, number]
}

export const loadData = async (url: string): Promise<IData> => {
    const csv = await (await fetch(url)).text()

    const rawData: IRecord[] = d3.csvParse(csv).reduce((acc: IRecord[], row) => {
        const id = row.Country
        const label = row.Country
        const year = row.Year
        const x = parseFloat((row['Economic Freedom Summary Index'] ?? '').replace(/\,/, '.')) ?? null
        const y = parseFloat(row.GDP ?? '') ?? null

        if (year && id && label && x && y) {
            const record: IRecord = {
                year,
                id,
                label,
                x,
                y
            }

            acc.push(record)
        }
        return acc
    }, []);

    const yearSet: Set<number> = new Set()
    const countrySet: Set<string> = new Set()
    rawData.forEach((row) => {
        if (row.year) {
            yearSet.add(parseInt(row.year, 10))
            countrySet.add(row.label)
        }
    })

    const years = Array.from(yearSet)
    years.sort(d3.ascending)
    const countries = Array.from(countrySet)
    countries.sort(d3.ascending)

    interface IYearIndeces { [year: string]: number }
    const yearIndeces: IYearIndeces = years.reduce((acc: IYearIndeces, year, i) => {
        acc[year.toString()] = i
        return acc
    }, {});

    // const initialData: IRecord[][] = [];
    const data: IRecord[][] = rawData.reduce((acc: IRecord[][], row) => {
        const yearIndex = yearIndeces[row.year]
        acc[yearIndex] = acc[yearIndex] ?? []
        acc[yearIndex].push(row)
        return acc;
    }, new Array(years.length))

    return {
        countries,
        years,
        data,
        xDomain: [2, 9],
        yDomain: [d3.max(rawData, row => row.y) ?? 0, 0]
    }

};

// Country,
// Year
// GDP
// Economic Freedom Summary Index

// Size of Government,Legal System & Property Rights,Sound Money,Freedom to Trade Internationally,Regulation
