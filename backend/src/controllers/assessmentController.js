import {
  calculateAssessment
} from '../utils/assessmentScoring.js';

export async function createAssessment(
  req,
  res
) {
  try {
    const {
      answers
    } = req.body;

    let calculated;

    try {
      calculated =
        calculateAssessment(
          answers
        );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    const {
      totalScore,
      domainScores,
      riskLevel
    } = calculated;

    // Fail before saving if report storage has not been installed. Once the
    // migration is applied, its trigger saves assessment + report atomically.
    const { error: reportStorageError } = await req.supabase.from('reports').select('id').limit(0);
    if (reportStorageError) {
      return res.status(503).json({ success: false, message: 'Report storage is unavailable. Please contact the administrator before submitting again.' });
    }

    const {
      data,
      error
    } =
      await req.supabase
        .from('assessments')
        .insert({
          user_id: req.user.id,
          total_score: totalScore,
          risk_level: riskLevel,
          domain_scores:
            domainScores,
          answers
        })
        .select()
        .single();

    if (error) {
      console.error(
        'Create assessment database error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to save assessment.'
      });
    }

    return res.status(201).json({
      success: true,
      message:
        'Assessment saved successfully.',
      assessment: data
    });
  } catch (error) {
    console.error(
      'Create assessment error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to save assessment.'
    });
  }
}

export async function getAssessments(
  req,
  res
) {
  try {
    const {
      data,
      error
    } =
      await req.supabase
        .from('assessments')
        .select(
          'id, total_score, risk_level, domain_scores, completed_at'
        )
        .eq(
          'user_id',
          req.user.id
        )
        .order(
          'completed_at',
          {
            ascending: false
          }
        );

    if (error) {
      console.error(
        'Get assessments database error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to load assessment history.'
      });
    }

    return res.status(200).json({
      success: true,
      assessments: data
    });
  } catch (error) {
    console.error(
      'Get assessments error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to load assessment history.'
    });
  }
}

export async function getAssessmentById(
  req,
  res
) {
  try {
    const {
      id
    } = req.params;

    const {
      data,
      error
    } =
      await req.supabase
        .from('assessments')
        .select('*')
        .eq(
          'id',
          id
        )
        .eq(
          'user_id',
          req.user.id
        )
        .single();

    if (
      error ||
      !data
    ) {
      return res.status(404).json({
        success: false,
        message:
          'Assessment not found.'
      });
    }

    return res.status(200).json({
      success: true,
      assessment: data
    });
  } catch (error) {
    console.error(
      'Get assessment error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to load assessment.'
    });
  }
}
