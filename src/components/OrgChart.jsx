import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

function TreeNode({ node, employees, onSelect, visited = new Set() }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (visited.has(node.id)) {
    return (
      <div className="tree-node-wrapper">
        <div className="cycle-warning" style={{ color: 'var(--danger)', fontSize: 13, padding: '8px 12px', borderRadius: 6, border: '1px dashed var(--danger)', backgroundColor: 'var(--danger-glow)', fontWeight: 600 }}>
          Circular Reference Detected (ID: #{node.id})
        </div>
      </div>
    );
  }

  // Find children of this employee
  const children = employees.filter(emp => emp.managerId === node.id);
  const hasChildren = children.length > 0;
  const isExpandedChildren = hasChildren && isExpanded;

  const nextVisited = new Set(visited);
  nextVisited.add(node.id);

  return (
    <div className="tree-node-wrapper">
      <div 
        className={`tree-node-card ${!isExpandedChildren ? 'no-children' : ''}`}
        onClick={() => onSelect && onSelect(node)}
      >
        <div className="tree-node-name">{node.name}</div>
        <div className="tree-node-role">{node.role}</div>
        <div className="tree-node-dept">{node.department}</div>
        
        {hasChildren && (
          <button 
            className="collapse-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </button>
        )}
      </div>

      {isExpandedChildren && (
        <div className="tree-node-children">
          {children.map(child => (
            <TreeNode 
              key={child.id} 
              node={child} 
              employees={employees} 
              onSelect={onSelect} 
              visited={nextVisited}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChart({ employees, onSelectEmployee }) {
  const [zoom, setZoom] = useState(1);

  // Find roots (employees with no manager or managerId not matching any valid employee)
  const employeeIds = employees.map(e => e.id);
  const detectedRoots = employees.filter(emp => !emp.managerId || !employeeIds.includes(emp.managerId));

  // Fallback to first employee if no root detected to prevent org chart disappearance
  const roots = detectedRoots.length > 0
    ? detectedRoots
    : employees.length > 0
      ? [employees[0]]
      : [];

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Zoom Controls Toolbar */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
        <button 
          onClick={handleZoomOut} 
          className="btn btn-secondary btn-sm"
          title="Zoom Out"
          style={{ padding: '6px 10px' }}
        >
          <ZoomOut size={14} />
        </button>
        <button 
          onClick={handleZoomReset} 
          className="btn btn-secondary btn-sm"
          title="Reset Zoom"
          style={{ fontFamily: 'var(--font-mono)', minWidth: 50, padding: '6px 10px' }}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button 
          onClick={handleZoomIn} 
          className="btn btn-secondary btn-sm"
          title="Zoom In"
          style={{ padding: '6px 10px' }}
        >
          <ZoomIn size={14} />
        </button>
      </div>

      <div className="tree-container">
        <div 
          className="tree-inner" 
          style={{ transform: `scale(${zoom})` }}
        >
          {roots.length === 0 ? (
            <p className="text-muted">No organizational roots found.</p>
          ) : (
            roots.map(root => (
              <div key={root.id} className="tree-root">
                <TreeNode 
                  node={root} 
                  employees={employees} 
                  onSelect={onSelectEmployee} 
                  visited={new Set()}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
