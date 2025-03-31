import {breeds} from './data.js';
        

        // Templated Strings

        /* const first = 'travis';
        const last = "stodter";

        // const full_name = `${first} ${last}`;
        const full_name = fist + ' ' + last;

        console.log(full_name);

        const greeting = `Hello there, ${first + ' ' + last}`;

        console.log(greeting); */

        

        // Alternate way to do it without a variable for cat_breed
        // const cat_breeds_to_html = ({name, silly, fanciness}) => {}

        const cat_breed_to_html = (cat_breeds) => {
            const {name, silly, fanciness} = cat_breeds;

            return `
            <li>
                <p>${name}</p>
                <p><strong>Silly:</strong> ${silly}</p>
                <p><strong>Fanciness:</strong> ${fanciness}</p>
            </li>
            `; // Dont forget the closing mark for the string
        }


        // Day 1 version of turning list to html:

        // const list = (cat_breeds) => {
        //     let html = '';
        //     for (let i = 0; i < cat_breeds; i++){
        //         html += cat_breed_to_html(cat_breeds[i]);
        //         html += '\n';
        //     }

        //     return `
        //         <li>
        //             ${cat_breeds
        //                 .map(cat_breed => cat_breed_to_html(cat_breed))
        //                 .join('\n')
        //             }
        //         </li>
        //     `;
        // }


        // Day 2 version of turning list to html

        const all_cat_breeds_to_html = (cat_breeds) => {
            // List of all cats to become html

            const html_items = cat_breeds.map(cat_breed => {
                return cat_breed_to_html(cat_breed);
            });


            // By default js turns the array into a string including commas
            // which would break the html. Using .join removes the commas
            // and we replace them with newlines
            const list_html = `
                <ul>
                    ${html_items.join('\n')}
                </ul>
            `;

            return list_html;
        }

        const list_html = all_cat_breeds_to_html(breeds);


        document.querySelector('ul').outerHTML = list_html;

        // Comment the log
        //console.log(list_html);

        const get_cat_breeds_data = () => {
            // Make network call to get breeds data
            const something = fetch('breeds.json')
                .then(reponse => {
                    const somethignUseful = result.json();
                    return response.json();
                });
               /* not sure why this is erroring
                 .then(result => {
                    debugger;
                }); */

            return something;
        }



