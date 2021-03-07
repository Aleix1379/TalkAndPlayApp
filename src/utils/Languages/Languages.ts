import languages from '../../store/languages.json'
import {Option} from "../../types/PostsTypes";


class Languages {
  public static sortLanguages(userLanguages: Option[]): Option[] {
    const incl: Option[] = []
    const excl: Option[] = []

    languages.forEach((lang: Option) => {
      if (userLanguages.find((userLang) => lang.id === userLang.id)) {
        incl.push(lang)
      } else {
        excl.push(lang)
      }
    })

    return [...incl, ...excl]
  }
}

export default Languages
