export const formatPromptString = `
Structure your response using HTML tags for clear hierarchy and organization. Follow these rules:

1. **Headings**:  
   - Use <h1> for main categories and primary definitions, numbered sequentially (e.g., 1, 2, 3).  
   - Use <h2> to <h6> for subheadings as needed. Do not number these unless specified.

2. **Paragraphs**:  
   - Use <p> for detailed explanations or descriptions.

3. **Lists**:  
   - Use <ul> for unordered lists and <ol> for ordered lists, with <li> for individual items.

4. **Emphasis**:  
   - Use <strong> for key terms and <em> for notable data like statistics.

5. **Containers**:  
   - Group related content using <div> or <section>.

6. **Links**:  
   - Use <a> for hyperlinks, ensuring meaningful text and an href attribute.

7. **Tables**:  
   - Use <table> with <thead>, <tbody>, and <tr> for structure, and <th>/<td> for cells.

8. **Media**:  
   - Use <img> for images, ensuring the alt attribute is included for accessibility.

9. **Code Blocks**:  
   - Use <pre> and <code> for code snippets. Indicate the language in the surrounding explanation (e.g., Python, JavaScript). Ensure proper formatting.

### Example Structure
<div>
  <h1>1. Main Topic</h1>
  <p>Explanation of the concept or topic.</p>
  <h2>Subtopic</h2>
  <ul>
    <li><strong>Key detail</strong> or example</li>
  </ul>
  <h1>2. Second Main Topic</h1>
  <p><strong>Detailed explanation</strong> with <em>important data</em>.</p>
  <pre><code>
# Example Python code
def sample():
    print("Hello, HTML!")
  </code></pre>
  <ol>
    <li>Step 1</li>
    <li>Step 2</li>
  </ol>
</div>

### Notes:
- Use appropriate HTML elements for semantics.
- Maintain sequential numbering for <h1> headings.
- Ensure clarity and consistency in formatting and grouping.
- Avoid deprecated HTML elements.
- Highlight key details effectively with <strong> and <em>.
- Always wrap <code> snippets in a <pre> tag for proper formatting.
`;
