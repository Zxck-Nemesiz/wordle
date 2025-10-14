export async function POST( req : Request ) {
    const body = await req.json()

    try {
        const response = await fetch('https://wordle-api.vercel.app/api/wordle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
        })
        return Response.json(await response.json())
    }
    catch (error) {
        console.error('Error: ' + error)
    }

    
}