import React, { useState, useEffect, useCallback } from 'react';
import { fetchConfig } from '../api/backendApi';

const ConfigModal = ({ isOpen, onClose, configKey, title }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchConfig(configKey);
      setContent(data.value || 'Content not available');
    } catch (error) {
      console.error('Failed to load config:', error);
      setContent('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [configKey]);

  useEffect(() => {
    if (isOpen && configKey) {
      loadConfig();
    }
  }, [isOpen, configKey, loadConfig]);

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
