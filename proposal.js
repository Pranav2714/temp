const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAEwiKHPiFMh6bcrJBvpryExpZVIqHslWs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.generateBusinessModel = async (req, res) => {
  const userData = req.body;
    console.log("User Data:", userData);

    // Validate input
    const requiredFields = [
        "companyName", 
        "businessProblem", 
        "businessSolution", 
        "targetMarket", 
        "revenueModel", 
        "financialGoal"
    ];

   

    const prompt = `
      Generate a comprehensive business proposal for a company named **${userData.companyName}**.
      - **Problem**: ${userData.businessProblem}
      - **Solution**: ${userData.businessSolution}
      - **Target Market**: ${userData.targetMarket}
      - **Revenue Model**: ${userData.revenueModel}
      - **Financial Goal**: ${userData.financialGoal}

      The proposal should highlight:
      - Market potential
      - Competitive advantages
      - Financial projections

      Ensure it is persuasive and tailored to entice potential investors or venture capitalists.
    `;
    console.log(prompt);
    try {
       
        const result = await model.generateContent(prompt);
        const proposalContent = result.response.text().replace(/\*/g, ''); // Get the generated content without asterisks
        res.status(200).json({ businessmodel: proposalContent });
      } catch (error) {
        console.error("Error generating content:", error);
        res
          .status(500)
          .json({ message: "Error generating businessmodel", error });
      }
     
    };
    