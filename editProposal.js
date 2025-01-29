let proposals = []; // This can be replaced with a database in a real application

exports.editProposal = async (req, res) => {
    const { id, updatedData } = req.body;

    // Validate input
    if (!id || !updatedData) {
        return res.status(400).json({ message: "ID and updated data are required." });
    }

    // Find the proposal by ID
    const proposalIndex = proposals.findIndex(proposal => proposal.id === id);

    if (proposalIndex === -1) {
        return res.status(404).json({ message: "Proposal not found." });
    }

    // Update the proposal
    proposals[proposalIndex] = { ...proposals[proposalIndex], ...updatedData };
    res.status(200).json({ message: "Proposal updated successfully!", proposal: proposals[proposalIndex] });
};