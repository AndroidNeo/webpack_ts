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
            'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,c1.t3,c2.t1,f,f,w;w,f,f,c3.t2,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,c1,c2,f,f,w;w,f,f,c3,f.t4,f.t3,f,w;w,f,f,c4,f.t2,f.t1,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,f,f,c1.t3,c2.t1,f,f,w;w,f,f,c3.t2,c4.t4,f,f,w;w,f,f,f,f,f,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,w,w,f,f,w,w,w;w,w,f,c1,f.t4,f,w,w;w,f,f,c2,f.t2,f,f,w;w,f,f,c3.t1,c4.t5,f,f,w;w,w,f,f.t3,c5,f,w,w;w,w,w,f,f,w,w,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,c1,c2,c3,c4,f,w;w,w,w,c5,c6,w,w,w;w,w,w,f.t1,f.t5,w,w,w;w,f,f.t3,f.t4,f.t6,f.t2,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,w,w,w,w,w,w,w;w,w,f,f,f,f,f,w;w,w,f,w,c1.t5,w,f,w;w,w,f,c2.t2,c3.t1,c4.t4,f,w;w,w,f,w,c5.t3,w,f,w;w,w,f,f,f,f,f,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,w,f,f,f,f,w,w;w,f,w,f,w,w,f,w;w,f,c1.t5,c2.t2,c3.t6,w,f,w;w,f,w,c4.t1,c5.t4,c6.t3,f,w;w,f,w,w,f,w,f,w;w,w,f,f,f,f,w,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,c1.t5,f,f,w;w,f,f,f,c2.t6,c3.t4,f,w;w,w,w,w,c4.t2,w,w,w;w,f,f,c5.t1,c6.t7,f,f,w;w,f,f,f,c7.t3,f,f,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,w,f,f,f,f,w,w;w,f,w,c1.t3,c2.t1,w,f,w;w,f,w,c3.t2,c4.t5,w,f,w;w,f,w,c5.t6,c6.t4,w,f,w;w,w,f,f,f,f,w,w;w,w,f,f,f,f,w,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,f,f,f,f,f,f,w;w,f,f,f,w,w,f,w;w,f,c1.t6,c2.t1,c3.t5,w,f,w;w,f,w,c4.t3,c5.t2,f,f,w;w,f,w,w,c6.t4,f,f,w;w,f,f,f,f,f,f,w;w,w,w,w,w,w,w,w;'
            ,'w,w,w,w,w,w,w,w;w,f,w,f,w,f,f,w;w,f,w,c1.t4,w,f,f,w;w,f,c2.t5,c3.t6,c4.t3,f,f,w;w,f,f,c5.t2,w,f,f,w;w,f,w,c6.t1,w,f,f,w;w,f,w,f,w,f,f,w;w,w,w,w,w,w,w,w;'
        ];

        return result;
        
    }
    
    static getCount() {
        return Levels.getRawLevels().length;
    }

}