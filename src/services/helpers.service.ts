
// TODO 
export function calculateSeasonLength()
{
    return 14;
}

export function createMatchups(teams, numWeeks)
{
    const matchups = [];
    let offset = 0;

    for(let week = 1; week <= numWeeks; week++)
    {
        for(let teamNum = 0; teamNum < teams.length / 2; teamNum++)
        {
            const home = teamNum;
            const away = (teamNum + offset) % teams.length;

            const matchup = {
                week: week,
                team1_id: teams[home].id,
                team2_id: teams[away].id,
            };

            matchups.push(matchup);
        }

        offset++;
    }

    return matchups;
}