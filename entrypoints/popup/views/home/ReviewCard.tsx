export function ReviewCard() {
  return (
    <div className="review-card">
      <div className="review-card-header">
        <span className="problem-number">#1</span>
        <span className="problem-difficulty">Easy</span>
      </div>

      <div className="review-card-content">
        <h3 className="problem-title">Two Sum</h3>
        <p className="problem-description text-red-500">
          Given an array of integers nums and an integer target, return indices of the two numbers such that they add up
          to target.
        </p>
      </div>

      <div className="review-card-footer">
        <div className="review-actions">
          <button className="review-button again">Again</button>
          <button className="review-button hard">Hard</button>
          <button className="review-button good">Good</button>
          <button className="review-button easy">Easy</button>
        </div>
      </div>
    </div>
  );
}
