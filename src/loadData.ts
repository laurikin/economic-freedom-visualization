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

    const years: Set<number> = new Set();
    rawData.forEach((row) => {
        if (row.year) {
            years.add(parseInt(row.year, 10))
        }
    })

    interface IYearIndeces { [year: string]: number }
    const yearIndeces: IYearIndeces = Array.from(years).reduce((acc: IYearIndeces, year, i) => {
        acc[year.toString()] = i
        return acc
    }, {});

    // const initialData: IRecord[][] = [];
    const data: IRecord[][] = rawData.reduce((acc: IRecord[][], row) => {
        const yearIndex = yearIndeces[row.year]
        acc[yearIndex] = acc[yearIndex] ?? []
        acc[yearIndex].push(row)
        return acc;
    }, new Array(years.size))

    return {
        years: Array.from(years),
        data,
        xDomain: [0, d3.max(rawData, row => row.x) ?? 0],
        yDomain: [d3.max(rawData, row => row.y) ?? 0, 0]
    }

};

// Country,
// Year
// GDP
// Economic Freedom Summary Index

// Size of Government,Legal System & Property Rights,Sound Money,Freedom to Trade Internationally,Regulation