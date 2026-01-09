export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  /**
   * Recives a string and normaliza it as a slug
   *
   * Example: "An example title => "an-examplo-title""
   * @param text {string}
   */
  static createFromText(text: string): Slug {
    // remove as acentuções da string
    const slugText = text
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // s = espaços em branco, enquanto o g é de global (pegar todos)
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "")
      .replace(/--+/g, "-")
      .replace(/-$/g, ""); // se no final da string ficou um hífem

    return new Slug(slugText);
  }
}
