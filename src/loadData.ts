import * as d3 from 'd3'
import { ITrailPlotData } from './TrailPlot'

export interface IRecord {
    year: string
    id: string
    label: string
    region: string
    x: number
    y: number
}

export interface IData {
    years: number[]
    countries: string[]
    regions: string[]
    data: IRecord[][]
    trailplotData: ITrailPlotData
    xDomain: [number, number],
    yDomain: [number, number]
}

export const loadData = async (url: string): Promise<IData> => {
    const csv = await (await fetch(url)).text()

    const rawData: IRecord[] = d3.csvParse(csv).reduce((acc: IRecord[], row) => {
        const id = row.Country
        const label = row.Country
        const year = row.Year
        const region = row['Political Region'] ?? ''
        const x = parseFloat((row['Economic Freedom Summary Index'] ?? '').replace(/,/, '.')) ?? null
        const y = parseFloat(row.GDP ?? '') ?? null

        if (year && id && label && x && y) {
            const record: IRecord = {
                year,
                region,
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
    const regionSet: Set<string> = new Set()
    rawData.forEach((row) => {
        if (row.year) {
            yearSet.add(parseInt(row.year, 10))
            countrySet.add(row.label)
            regionSet.add(row.region)
        }
    })

    const years = Array.from(yearSet)
    years.sort(d3.ascending)
    const countries = Array.from(countrySet)
    countries.sort(d3.ascending)
    const regions = Array.from(regionSet)
    regions.sort(d3.ascending)

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


    const trailplotData: ITrailPlotData = rawData.reduce((acc: ITrailPlotData, row) => {
        acc[row.id] = acc[row.id] || {
            id: row.id,
            label: row.label,
            data: Array(years.length).fill(null)
        }

        acc[row.id].data[yearIndeces[row.year]] = {
            x: row.x,
            y: row.y
        }

        const a = acc
        return a
    }, {})



    return {
        countries,
        regions,
        years,
        data,
        trailplotData,
        xDomain: [2, 9.5],
        yDomain: [(d3.max(rawData, row => row.y) ?? 0) * 1.02, 0]
    }

};

// Country,
// Year
// GDP
// Economic Freedom Summary Index

// Size of Government,Legal System & Property Rights,Sound Money,Freedom to Trade Internationally,Regulation
