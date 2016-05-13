/**
 * Created by Artur on 11.05.16.
 */

export class Levels {

    static getLevelByNumber(levelNumber: number) {

        let result:string[][] = [];

        let level = Levels.getRawLevelByNumber(levelNumber);

        let rows:string[] = [];
        let p1 = -1;
        while (true) {
            let p2 = level.indexOf(';', p1 + 1);
            if (p2 > 0) {
                let row = level.substr(p1 + 1, p2 - p1 - 1);
                rows.push(row);
                p1 = p2;
            } else {
                break;
            }
        }

        for (let i = 0; i < rows.length; i++) {

            let rowDetail:string[] = [];

            let row = rows[i];
            row = row + ',';

            let p1 = -1;
            while (true) {
                let p2 = row.indexOf(',', p1 + 1);
                if (p2 > 0) {
                    let cellContent = row.substr(p1 + 1, p2 - p1 - 1);
                    rowDetail.push(cellContent);
                    p1 = p2;
                } else {
                    break;
                }
            }

            result.push(rowDetail);

        }

        return result;

    }

    private static getRawLevelByNumber(levelNumber: number) {

        let levels = Levels.getRawLevels();

        return levels[levelNumber - 1];

    }

    private static getRawLevels() {
        
        let result = [
            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,c1,c2,f,f,w;w,f,f,c3,f.t3,f.t1,f,w;w,f,f,f,f.t2,f,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;'
        ];

        return result;
        
    }
    
    static getCount() {
        return Levels.getRawLevels().length;
    }

}