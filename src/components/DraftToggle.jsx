function DraftToggle({ showDrafts, setShowDrafts }) {

    return (
        <button
            className={`tab-button ${showDrafts ? "active" : ""}`}
            onClick={() => setShowDrafts(!showDrafts)}
        >
            {
                showDrafts
                    ? "下書き表示中"
                    : "下書きを表示"
            }
        </button>
    );
}

export default DraftToggle;